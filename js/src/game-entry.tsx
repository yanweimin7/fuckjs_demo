import React from "react";
import { Router, Runtime } from "fuickjs";
import GamePage from "./pages/game";

function initApp() {
  try {
    Runtime.configure({ prewarm: false, prewarmMs: 50 });
    Runtime.bindGlobals();

    Router.register("/", () => React.createElement(GamePage));
    console.log("Game Bundle Initialized");
  } catch (e) {
    console.error("initApp error:", e);
  }
}

// 将 initApp 挂载到全局，方便 Flutter 主动调用
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).initApp = initApp;

// 同时尝试立即初始化
initApp();
