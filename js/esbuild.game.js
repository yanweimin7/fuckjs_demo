const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// qjsc 编译器路径（可选，不存在时跳过字节码编译）
const QJSC_PATH = path.resolve(
  __dirname,
  "../../fuickjs_engine/src/main/jni/quickjs/build_macos/qjsc",
);

async function build() {
  const reactPath = "node_modules/react/cjs/react.production.js";
  const reconcilerPath =
    "node_modules/react-reconciler/cjs/react-reconciler.production.js";
  const schedulerPath = "node_modules/scheduler/cjs/scheduler.production.js";

  const banner = {
    js: `var process=process||{env:{NODE_ENV:"production"}};if(typeof console==="undefined"){globalThis.console={log:function(){if(typeof print==='function')print([].slice.call(arguments).join(' '));},error:function(){if(typeof print==='function')print('[ERROR] '+[].slice.call(arguments).join(' '));},warn:function(){if(typeof print==='function')print('[WARN] '+[].slice.call(arguments).join(' '));},debug:function(){if(typeof print==='function')print('[DEBUG] '+[].slice.call(arguments).join(' '));}};}`,
  };

  const alias = {
    react: path.resolve(__dirname, reactPath),
    "react-reconciler": path.resolve(__dirname, reconcilerPath),
    scheduler: path.resolve(__dirname, schedulerPath),
    fuickjs: path.resolve(
      __dirname,
      "../../fuickjs_framework/fuickjs/dist/index.js",
    ),
  };

  const commonOptions = {
    bundle: true,
    target: "es2020",
    minify: false,
    sourcemap: false,
    loader: {
      ".ts": "ts",
      ".tsx": "tsx",
    },
    define: {
      "process.env.NODE_ENV": '"production"',
      global: "globalThis",
    },
    banner,
    alias,
  };

  // ── Native build（ESM，供 QuickJS eval / qjsc 字节码）──────────────────────
  const nativeDestDir = path.resolve(__dirname, "../app/assets/js");
  if (!fs.existsSync(nativeDestDir)) {
    fs.mkdirSync(nativeDestDir, { recursive: true });
  }

  await esbuild.build({
    ...commonOptions,
    platform: "neutral",
    format: "esm",
    mainFields: ["module", "main"],
    entryPoints: ["src/game-entry.tsx"],
    outfile: "dist/game.js",
  });
  console.log("Native (ESM) game bundle built at dist/game.js");

  const src = path.resolve(__dirname, "dist/game.js");
  const dest = path.join(nativeDestDir, "game.js");
  fs.copyFileSync(src, dest);
  console.log(`Copied game bundle to ${dest}`);

  if (fs.existsSync(QJSC_PATH)) {
    console.log("Compiling game bundle to QuickJS bytecode...");
    execSync(`${QJSC_PATH} -b -o ${dest}.qjc ${src}`);
    console.log(`Compiled to ${dest}.qjc`);
  }

  // ── Web build（IIFE，供浏览器 <script> / importScripts 加载）──────────────
  const webDestDir = path.resolve(__dirname, "dist/web");
  if (!fs.existsSync(webDestDir)) {
    fs.mkdirSync(webDestDir, { recursive: true });
  }

  await esbuild.build({
    ...commonOptions,
    platform: "browser",
    format: "iife",
    mainFields: ["browser", "module", "main"],
    entryPoints: ["src/game-entry.tsx"],
    outfile: path.join(webDestDir, "game.js"),
  });
  console.log(`Web (IIFE) game bundle built at ${path.join(webDestDir, "game.js")}`);

  // 拷贝框架 Worker 入口，供 Worker DSL 模式（FuickAppView(workerUrl:)）一并部署。
  const workerSrc = path.resolve(
    __dirname,
    "../../fuickjs_framework/fuickjs/dist/worker/entry.js",
  );
  if (fs.existsSync(workerSrc)) {
    fs.copyFileSync(workerSrc, path.join(webDestDir, "fuick-worker.js"));
    console.log("Copied fuick-worker.js");
  } else {
    console.warn(
      "framework dist/worker/entry.js not found; run `npm run build` in fuickjs_framework/fuickjs first",
    );
  }

  console.log("Game bundle build complete (native + web).");
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
