/**
 * 游戏状态模型与可订阅存储（重渲染桥接）。
 * 游戏逻辑（step/spawn/capture）在 ../game/engine 中实现，本文件只持有
 * 数据模型与订阅机制，供 React 组件订阅并触发重渲染。
 */

import type { StageDef } from "../game/config";
import { STAGES, FINAL_MATTER } from "../game/config";
import { createGame } from "../game/engine";

/** 自由天体 / 玩家 / 环绕卫星实体。 */
export interface Entity {
  id: number;
  /** 世界坐标。 */
  x: number;
  y: number;
  /** 漂移速度（px/s）。 */
  vx: number;
  vy: number;
  /** 碰撞半径（决定体型）。 */
  radius: number;
  /** 进化等级 0 基索引，用于碰撞的「战力」比较。 */
  power: number;
  /** 被吞噬时提供的物质。 */
  matterValue: number;
  /** 是否为被捕获的环绕卫星。 */
  isSatellite: boolean;
  /** 环绕轨道角（卫星专用）。 */
  angle?: number;
  /** 环绕轨道半径（卫星专用）。 */
  orbitRadius?: number;
  /** 引擎内部标记：本帧已被吞噬 / 撞击消耗，待移除。 */
  removed?: boolean;
}

export type GameStatus = "playing" | "gameover" | "win";

export interface GameState {
  status: GameStatus;
  player: Entity;
  entities: Entity[];
  satellites: Entity[];
  /** 累计物质总量。 */
  matter: number;
  /** 当前等级 0 基索引。 */
  stageIndex: number;
  health: number;
  maxHealth: number;
  time: number;
  /** 记录「比玩家明显更大」天体的生成时间戳，用于每分钟生成数限速。 */
  bigSpawnTimes: number[];
  nextEntityId: number;
  /** 受击闪烁剩余帧。 */
  hitFlash: number;
  /** 卫星抵挡闪烁剩余帧。 */
  blockFlash: number;
}

/** 摇杆输入：dx/dy 为相对起点的位移（像素），intensity 为 0~1 强度。 */
export interface InputState {
  dx: number;
  dy: number;
  intensity: number;
}

/**
 * 轻量游戏存储：持有 GameState，提供订阅/通知以桥接 React 重渲染。
 * 引擎函数就地修改 state，随后调用 notify() 触发订阅者重渲染。
 */
export class GameStore {
  private state: GameState;
  private listeners = new Set<() => void>();

  constructor() {
    this.state = createGame();
  }

  getState(): GameState {
    return this.state;
  }

  /** 覆盖整个状态（用于重新开始）。 */
  setState(next: GameState): void {
    this.state = next;
    this.notify();
  }

  /** 引擎就地修改后通知订阅者重渲染。 */
  notify(): void {
    this.listeners.forEach((l) => l());
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /** 重新开始一局。 */
  reset(): void {
    this.setState(createGame());
  }
}

export { STAGES, FINAL_MATTER };
export type { StageDef };
