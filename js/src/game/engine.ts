/**
 * 游戏核心引擎：实体生成、固定步长推进、移动、圆形碰撞结算（吞噬 / 受伤）、
 * 进化切换、捕获与环绕卫星。所有函数就地修改传入的 GameState。
 *
 * 世界坐标 1 单位 = 屏幕 1 像素：玩家居中（相机），实体以绝对坐标存储，
 * 半径 r 既是绘制半径也是碰撞半径。绘制与碰撞天然一致，无「缩放 / 视觉半径」折算。
 */

import type { Entity, GameState, InputState } from "../store/game";
import {
  STAGES,
  FINAL_MATTER,
  DT,
  PLAYER_SPEED,
  SPAWN_GAP_MIN,
  SPAWN_GAP_MAX,
  DESPAWN_DIST,
  CAPTURE_RANGE,
  TARGET_ENTITIES,
  DAMAGE,
  MAX_HEALTH,
  HIT_FLASH_FRAMES,
  BIG_PER_MINUTE,
  BIG_WINDOW,
  MATTER_FLOOR,
  MATTER_CAP,
  GROWTH,
  GROWTH_CAP,
  ORBIT_SPEED,
} from "./config";

const rand = (min: number, max: number): number => min + Math.random() * (max - min);

function dist(ax: number, ay: number, bx: number, by: number): number {
  return Math.hypot(ax - bx, ay - by);
}

/** 创建一个新游戏状态（玩家为陨石，生成初始天体）。 */
export function createGame(): GameState {
  const state: GameState = {
    status: "playing",
    player: {
      id: 0,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      radius: STAGES[0].r,
      power: 0,
      matterValue: 0,
      isSatellite: false,
    },
    entities: [],
    satellites: [],
    matter: 0,
    stageIndex: 0,
    health: MAX_HEALTH,
    maxHealth: MAX_HEALTH,
    time: 0,
    bigSpawnTimes: [],
    nextEntityId: 1,
    hitFlash: 0,
    blockFlash: 0,
  };
  while (state.entities.length < TARGET_ENTITIES) {
    spawnEntity(state);
  }
  return state;
}

/**
 * 在玩家周围随机生成一颗自由天体。
 * 等级分布相对玩家当前等级：约一半明显更低（可吞噬），一小半同级，一小部分明显更高（需躲避）。
 * 同级再分两类：约半数真实半径比玩家小（可吞噬），约半数与玩家相当/更大（不可吞噬，撞击掉血）。
 * 生成距离以「屏幕像素间隙」衡量，避免真实半径巨大的高阶天体被生成在极远处而瞬间回收。
 */
export function spawnEntity(state: GameState): void {
  const pr = state.stageIndex;
  const p = state.player;
  const r = Math.random();

  let category: "small" | "mid" | "big";
  if (r < 0.5) category = "small";
  else if (r < 0.85) category = "mid";
  else category = "big";

  // 限速：滚动窗口内「明显更大」天体已达上限 → 降级为可吞噬的小天体。
  if (category === "big") {
    state.bigSpawnTimes = state.bigSpawnTimes.filter(
      (t) => state.time - t <= BIG_WINDOW,
    );
    if (state.bigSpawnTimes.length >= BIG_PER_MINUTE) {
      category = "small";
    }
  }

  let power: number;
  let radius: number;
  if (category === "small") {
    // 多数：明显低于玩家 → 可被吞噬。
    power = Math.max(0, pr - 1 - Math.floor(Math.random() * 2));
    radius = STAGES[power].r * rand(0.5, 0.85);
  } else if (category === "mid") {
    // 同级：半数比玩家小（可吞噬），半数与玩家相当/更大（不可吞噬）。
    power = pr;
    if (Math.random() < 0.5) {
      radius = p.radius * rand(0.5, 0.85); // < 玩家 → 可吞
    } else {
      radius = p.radius * rand(1.0, 1.25); // >= 玩家 → 不可吞
    }
  } else {
    // 少数：明显大于玩家两阶以上 → 需躲避（碰之即死）。
    power = Math.min(STAGES.length - 1, pr + 2 + Math.floor(Math.random() * 2));
    radius = STAGES[power].r;
    state.bigSpawnTimes.push(state.time);
  }
  radius = Math.max(1, radius);

  const matterValue = Math.max(
    MATTER_FLOOR,
    Math.min(MATTER_CAP, Math.round(radius * 0.6)),
  );
  const ang = Math.random() * Math.PI * 2;
  // 生成距离 = 双方半径 + 像素间隙，保证天体出现在玩家屏幕边缘附近且不重叠。
  const d = p.radius + radius + rand(SPAWN_GAP_MIN, SPAWN_GAP_MAX);
  const sp = rand(8, 20);
  const sang = Math.random() * Math.PI * 2;

  state.entities.push({
    id: state.nextEntityId++,
    x: p.x + Math.cos(ang) * d,
    y: p.y + Math.sin(ang) * d,
    vx: Math.cos(sang) * sp,
    vy: Math.sin(sang) * sp,
    radius,
    power,
    matterValue,
    isSatellite: false,
  });
}

/** 保证玩家周围始终存在「下一等级」天体（进化链的直接目标）。不计入大天体限速。 */
export function forceSpawnNext(state: GameState): void {
  const pr = state.stageIndex;
  if (pr >= STAGES.length - 1) return;
  const p = state.player;
  const power = pr + 1;
  const radius = STAGES[power].r;
  const matterValue = Math.max(
    MATTER_FLOOR,
    Math.min(MATTER_CAP, Math.round(radius * 0.6)),
  );
  const ang = Math.random() * Math.PI * 2;
  const d = p.radius + radius + rand(SPAWN_GAP_MIN, SPAWN_GAP_MAX);
  const sp = rand(8, 20);
  const sang = Math.random() * Math.PI * 2;
  state.entities.push({
    id: state.nextEntityId++,
    x: p.x + Math.cos(ang) * d,
    y: p.y + Math.sin(ang) * d,
    vx: Math.cos(sang) * sp,
    vy: Math.sin(sang) * sp,
    radius,
    power,
    matterValue,
    isSatellite: false,
  });
}

/** 吞噬：更低等级天体被移除，累加物质并回血，玩家尺寸微增。 */
function absorb(state: GameState, e: Entity): void {
  let gain = e.matterValue;
  // 中子星(L9) / 黑洞(L10) / 宇宙(L11) 吸收恒星及以下获得额外能量。
  if (state.stageIndex >= 8 && e.power <= 6) {
    gain += Math.round(e.matterValue * 0.5);
  }
  state.matter += gain;
  const base = STAGES[state.stageIndex].r;
  state.player.radius = Math.min(state.player.radius + GROWTH, base * GROWTH_CAP);
  const heal = Math.min(state.maxHealth - state.health, 1);
  state.health = Math.min(state.maxHealth, state.health + heal);
  e.removed = true;
}

/** 玩家与某天体的碰撞结算。
 * 规则：更低等级 → 吞噬；同类中真实半径明显更小者亦视为食物；
 * 同类中相当/更大者 → 撞击掉血且敌方死（卫星可抵挡）；更高等级 → 直接死亡。 */
function resolveCollision(state: GameState, e: Entity): void {
  const p = state.player;
  const pr = state.stageIndex;
  const rr = p.radius + e.radius;
  if (dist(p.x, p.y, e.x, e.y) >= rr) return;

  // 更低等级：吞噬（吸收物质回血）。
  if (e.power < pr) {
    absorb(state, e);
    return;
  }

  // 更高等级（明显更大的天体）：直接死亡，敌方毫发无损。
  if (e.power > pr) {
    state.health = 0;
    state.hitFlash = HIT_FLASH_FRAMES;
    state.status = "gameover";
    return;
  }

  // 同类：真实半径比玩家小 → 吞噬；与玩家相当/更大 → 撞击掉血且敌方死。
  if (e.radius < p.radius * 0.95) {
    absorb(state, e);
    return;
  }
  const canShield = state.stageIndex >= 3 && state.satellites.length > 0;
  if (canShield) {
    state.satellites.splice(0, 1);
    state.blockFlash = HIT_FLASH_FRAMES;
  } else {
    state.health -= DAMAGE;
    state.hitFlash = HIT_FLASH_FRAMES;
  }
  e.removed = true;
  if (state.health <= 0) {
    state.health = 0;
    state.status = "gameover";
  }
}

/** 捕获：将捕获半径内最近的行星变为环绕卫星。仅 L4+ 可用。 */
export function tryCapture(state: GameState): void {
  if (!STAGES[state.stageIndex].canCapture) return;
  const p = state.player;
  let bestIdx = -1;
  let bestD = Infinity;
  for (let i = 0; i < state.entities.length; i++) {
    const e = state.entities[i];
    const d = dist(p.x, p.y, e.x, e.y);
    if (d <= p.radius + e.radius + CAPTURE_RANGE && d < bestD) {
      bestD = d;
      bestIdx = i;
    }
  }
  if (bestIdx < 0) return;
  const e = state.entities[bestIdx];
  state.entities.splice(bestIdx, 1);
  e.isSatellite = true;
  e.angle = Math.random() * Math.PI * 2;
  // 轨道半径随玩家半径缩放（低等级用固定内移量），保证卫星始终环绕在玩家外侧。
  e.orbitRadius = p.radius * (1.4 + 0.25 * state.satellites.length);
  state.satellites.push(e);
}

/** 调试：直接提升一个等级（进化到下一阶段），并补满血量，便于快速预览各阶段体型。 */
export function forceLevelUp(state: GameState): void {
  if (state.stageIndex >= STAGES.length - 1) return;
  state.stageIndex++;
  state.player.radius = STAGES[state.stageIndex].r;
  state.player.power = state.stageIndex;
  state.health = state.maxHealth;
  state.matter = STAGES[state.stageIndex].reachMatter;
}

/** 推进一帧。input 为当前摇杆输入，dt 为步长（秒）。 */
export function step(
  state: GameState,
  input: InputState,
  dt: number = DT,
): void {
  if (state.status !== "playing") return;
  state.time += dt;
  if (state.hitFlash > 0) state.hitFlash--;
  if (state.blockFlash > 0) state.blockFlash--;

  // 玩家移动：摇杆方向（归一化）× 强度 → 速度（屏幕恒定速度）。
  const speed = PLAYER_SPEED;
  const mag = Math.hypot(input.dx, input.dy);
  if (mag > 1 && input.intensity > 0) {
    const vx = (input.dx / mag) * speed * input.intensity;
    const vy = (input.dy / mag) * speed * input.intensity;
    state.player.x += vx * dt;
    state.player.y += vy * dt;
  }

  // 自由天体漂移。
  for (const e of state.entities) {
    e.x += e.vx * dt;
    e.y += e.vy * dt;
  }

  // 环绕卫星更新轨道角。
  for (const s of state.satellites) {
    s.angle = (s.angle ?? 0) + ORBIT_SPEED * dt;
  }

  // 碰撞结算。
  for (const e of state.entities) {
    if (e.removed) continue;
    resolveCollision(state, e);
  }

  // 移除被吞噬 / 撞击消耗的天体。
  state.entities = state.entities.filter((e) => !e.removed);

  // 回收过远天体。
  state.entities = state.entities.filter(
    (e) => dist(state.player.x, state.player.y, e.x, e.y) <= DESPAWN_DIST,
  );

  // 维持同屏数量。
  while (state.entities.length < TARGET_ENTITIES) {
    spawnEntity(state);
  }

  // 进化链保底：周围始终存在「下一等级」天体，确保可一路向上进化。
  if (
    state.stageIndex < STAGES.length - 1 &&
    !state.entities.some((e) => e.power === state.stageIndex + 1)
  ) {
    forceSpawnNext(state);
  }

  // 进化切换：累计物质跨越阈值则升级，半径重置为等级基础值。
  // 每次只进化一阶：进化后将物质重置为本阶阈值，丢弃溢出，避免一次吞噬连跨多阶。
  while (
    state.stageIndex < STAGES.length - 1 &&
    state.matter >= STAGES[state.stageIndex + 1].reachMatter
  ) {
    state.stageIndex++;
    state.player.radius = STAGES[state.stageIndex].r;
    state.player.power = state.stageIndex;
    state.matter = STAGES[state.stageIndex].reachMatter;
  }

  // 结局：宇宙且物质达到 5000 → 另一个宇宙。
  if (state.stageIndex === STAGES.length - 1 && state.matter >= FINAL_MATTER) {
    state.status = "win";
  }
}
