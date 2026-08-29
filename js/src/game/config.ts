/**
 * 宇宙进化游戏 —— 可调参数与等级配置（游戏模型数据层）。
 * 仅依赖 fuickjs 现有导出能力，不修改框架层。
 *
 * 设计要点（与早期版本的「相机缩放 + 视觉半径 hack」彻底不同）：
 * 世界坐标 1 单位 = 屏幕 1 像素。每个天体的「屏幕半径」直接由所属等级决定
 * （见 STAGES[].r），因此绘制尺寸与碰撞尺寸天然一致 —— 你看到多大，碰撞就是多大，
 * 不会再出现「看着很远却被判定撞死」或「同级天体大小乱序」的问题。
 */

/** 单帧步长（秒）。TICK_RATE 帧/秒驱动固定步长游戏循环。 */
export const TICK_RATE = 30;
export const DT = 1 / TICK_RATE;

/** 虚拟视口尺寸（竖屏）。场地以 SizedBox 固定尺寸居中。 */
export const VW = 360;
export const VH = 640;
/** 玩家在场地中的屏幕中心坐标（相机始终让玩家居中）。 */
export const CENTER_X = VW / 2;
export const CENTER_Y = VH / 2;

/** 玩家移动速度（px/s），为屏幕上恒定速度，与等级无关。 */
export const PLAYER_SPEED = 95;

/** 虚拟摇杆最大半径（像素），决定强度归一化。 */
export const JOY_MAX_R = 50;

/** 环绕卫星轨道角速度（rad/s）。 */
export const ORBIT_SPEED = 0.7;

/** 生成时，天体中心与玩家中心之间的最小 / 最大「间隙」（像素，叠加在两者半径之外）。 */
export const SPAWN_GAP_MIN = 24;
export const SPAWN_GAP_MAX = 70;

/** 超出该距离（像素）的天体回收并重生（略大于半屏，保证离开视野后再回收）。 */
export const DESPAWN_DIST = 430;

/** 捕获半径：玩家半径之外多少像素内的行星可被捕获为卫星。 */
export const CAPTURE_RANGE = 26;

/** 同屏自由天体目标数量。 */
export const TARGET_ENTITIES = 18;

/** 单次受击（无卫星抵挡时）扣血。 */
export const DAMAGE = 25;
export const MAX_HEALTH = 100;
/** 受击闪烁持续帧数。 */
export const HIT_FLASH_FRAMES = 12;

/** 「明显大于玩家」天体每分钟最多生成个数（避免被围死无法逃脱）。 */
export const BIG_PER_MINUTE = 2;
export const BIG_WINDOW = 60;

/** 单次吞噬获得的物质下限 / 上限（按半径折算后 clamp）。 */
export const MATTER_FLOOR = 2;
export const MATTER_CAP = 2000;
/** 吞噬后玩家半径的增量（像素）与单等级内增长上限系数。 */
export const GROWTH = 0.6;
export const GROWTH_CAP = 1.2;

/** 进化等级定义。reachMatter = 累计物质达到该值即进化到该等级；r = 屏幕/世界半径(px)。 */
export interface StageDef {
  /** 1 基的等级序号（与进化顺序一致）。 */
  id: number;
  name: string;
  /** 进化到该等级所需的累计物质。 */
  reachMatter: number;
  /** 该等级天体的屏幕半径（像素）。严格单调递增以保证「等级越高越大」。 */
  r: number;
  color: string;
  /** 是否解锁捕获能力（岩石行星 L4 起）。 */
  canCapture: boolean;
  /** 是否发光（恒星及以上用于视觉区分）。 */
  glow: boolean;
}

/**
 * 进化顺序（用户指定，且为严格尺寸顺序）：
 * 陨石 < 小行星 < 矮星 < 岩石行星 < 气态行星 < 矮恒星 < 恒星 < 超巨星 < 中子星 < 黑洞 < 宇宙。
 * r 严格递增即保证屏幕上「等级越高画得越大」。
 */
export const STAGES: StageDef[] = [
  { id: 1, name: "陨石", reachMatter: 0, r: 5, color: "#9e9e9e", canCapture: false, glow: false },
  { id: 2, name: "小行星", reachMatter: 100, r: 9, color: "#a1887f", canCapture: false, glow: false },
  { id: 3, name: "矮星", reachMatter: 300, r: 14, color: "#ffcc80", canCapture: false, glow: false },
  { id: 4, name: "岩石行星", reachMatter: 800, r: 20, color: "#8d6e63", canCapture: true, glow: false },
  { id: 5, name: "气态行星", reachMatter: 1000, r: 27, color: "#ffb74d", canCapture: true, glow: false },
  { id: 6, name: "矮恒星", reachMatter: 1500, r: 35, color: "#fff176", canCapture: true, glow: true },
  { id: 7, name: "恒星", reachMatter: 2000, r: 45, color: "#ffd54f", canCapture: true, glow: true },
  { id: 8, name: "超巨星", reachMatter: 3000, r: 57, color: "#ff7043", canCapture: true, glow: true },
  { id: 9, name: "中子星", reachMatter: 3500, r: 70, color: "#b39ddb", canCapture: true, glow: true },
  { id: 10, name: "黑洞", reachMatter: 4000, r: 84, color: "#000000", canCapture: true, glow: true },
  { id: 11, name: "宇宙", reachMatter: 5000, r: 100, color: "#ffffff", canCapture: true, glow: true },
];

/** 黑洞达成后，累计物质达到该值进入「另一个宇宙」结局。 */
export const FINAL_MATTER = 5000;

/** 取某等级的 0 基索引（用于数组访问）。 */
export const stageIndexFromId = (id: number): number => id - 1;
