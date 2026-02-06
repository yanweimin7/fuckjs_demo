import { initApp } from "./app";

// 将 initApp 挂载到全局，方便 Flutter 主动调用
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).initApp = initApp;

// 同时尝试立即初始化
initApp();
