const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const watch = process.argv.includes("--watch");

// 注意：这里不生成 bundle.qjc。
// 字节码由运行时的 BundleCompiler（lib/core/engine/bundle_compiler.dart）
// 经 FFI qjs_compile_to_bytecode_out 在设备上首次加载时生成并落盘——编译器就在
// libquickjs_ffi.dylib 内，与引擎同版本，结构上不可能出现 BC_VERSION 漂移。
// 构建期用外部 qjsc 生成则要求它与引擎严格同版本，一旦失配就是
// "invalid version (NN expected=MM)"，且加载失败等于页面永远打不开。
// 代价是首屏走一次源码解析，之后命中本地 .qjc 缓存。

async function build() {
  const isProd = !watch;
  // React 19 dropped the .min suffix from cjs filenames
  const reactPath = isProd
    ? "node_modules/react/cjs/react.production.js"
    : "node_modules/react/cjs/react.development.js";
  const reconcilerPath = isProd
    ? "node_modules/react-reconciler/cjs/react-reconciler.production.js"
    : "node_modules/react-reconciler/cjs/react-reconciler.development.js";
  const schedulerPath = isProd
    ? "node_modules/scheduler/cjs/scheduler.production.js"
    : "node_modules/scheduler/cjs/scheduler.development.js";

  const commonOptions = {
    bundle: true,
    platform: "neutral",
    format: "esm",
    target: "es2020",
    minify: false,
    sourcemap: !isProd || process.env.SOURCEMAP === "true",
    loader: {
      ".ts": "ts",
      ".tsx": "tsx",
    },
    mainFields: ["module", "main"],
    define: {
      "process.env.NODE_ENV": isProd ? '"production"' : '"development"',
      global: "globalThis",
    },
    banner: {
      js: `var process=process||{env:{NODE_ENV:\"${isProd ? "production" : "development"}\"}};if(typeof console===\"undefined\"){globalThis.console={log:function(){if(typeof print==='function')print([].slice.call(arguments).join(' '));},error:function(){if(typeof print==='function')print('[ERROR] '+[].slice.call(arguments).join(' '));},warn:function(){if(typeof print==='function')print('[WARN] '+[].slice.call(arguments).join(' '));},debug:function(){if(typeof print==='function')print('[DEBUG] '+[].slice.call(arguments).join(' '));}};}`,
    },
  };

  const destDir = path.resolve(__dirname, "../app/assets/js");
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  console.log("Building bundle...");

  const buildOptions = {
    ...commonOptions,
    entryPoints: ["src/index.ts"],
    outfile: "dist/bundle.js",
    alias: {
      react: path.resolve(__dirname, reactPath),
      "react-reconciler": path.resolve(__dirname, reconcilerPath),
      scheduler: path.resolve(__dirname, schedulerPath),
      fuickjs: path.resolve(
        __dirname,
        "../../fuickjs_framework/fuickjs/dist/index.js",
      ),
    },
  };

  if (watch) {
    const ctx = await esbuild.context(buildOptions);
    await ctx.watch();
    console.log("Watching...");
    return;
  }

  await esbuild.build(buildOptions);

  const src = path.resolve(__dirname, "dist/bundle.js");
  const dest = path.join(destDir, "bundle.js");

  fs.copyFileSync(src, dest);
  console.log(`Copied bundle to ${dest}`);

  // 清掉历史构建留下的 .qjc：现在字节码由运行时生成，构建产物里带上旧的
  // 只会让加载方先撞一次 BC_VERSION 不匹配再被隔离成 .stale。
  const destBin = path.join(destDir, "bundle.qjc");
  if (fs.existsSync(destBin)) {
    fs.unlinkSync(destBin);
    console.log(`Removed stale bytecode ${destBin}`);
  }

  // Pack all bundles into zip files — skip in debug mode（SOURCEMAP 时不需要 zip）
  if (process.env.SOURCEMAP !== "true") {
    console.log("\nPacking bundles...");
    const packAll = path.resolve(__dirname, "tools/bundle/pack-all.js");
    execFileSync(process.execPath, [packAll], {
      stdio: "inherit",
      cwd: __dirname,
    });
  }

  // ── Web build (IIFE，best-effort) ─────────────────────────────────────────
  // 供 Flutter Web 宿主经 <script src> 加载；失败不影响 native 构建。
  try {
    const webDestDir = path.resolve(__dirname, "dist/web");
    if (!fs.existsSync(webDestDir)) fs.mkdirSync(webDestDir, { recursive: true });

    // Web 构建必须与 native 使用相同的 react / react-reconciler / scheduler
    // 别名，统一指向 fuickjs_demo/js/node_modules 下的同一份物理副本。
    // 否则 framework 的 dist/index.js（被 alias 到 framework）内部 require('react')
    // 会解析到 fuickjs_framework/.../node_modules/react，与 demo 源码的 react
    // 成为两份不同实例；reconciler 只在它自己的那份上设置 hooks dispatcher
    // （ReactSharedInternals.H），而组件用的另一份 H 为 null → 崩溃。
    await esbuild.build({
      ...commonOptions,
      platform: "browser",
      format: "iife",
      mainFields: ["browser", "module", "main"],
      entryPoints: ["src/index.ts"],
      outfile: path.join(webDestDir, "bundle.js"),
      alias: { ...buildOptions.alias },
    });

    const appWebDir = path.resolve(__dirname, "../app/web");
    if (!fs.existsSync(appWebDir)) fs.mkdirSync(appWebDir, { recursive: true });
    fs.copyFileSync(
      path.join(webDestDir, "bundle.js"),
      path.join(appWebDir, "bundle.js"),
    );

    const workerSrc = path.resolve(
      __dirname,
      "../../fuickjs_framework/fuickjs/dist/worker/entry.js",
    );
    if (fs.existsSync(workerSrc)) {
      fs.copyFileSync(workerSrc, path.join(appWebDir, "fuick-worker.js"));
    }
    console.log("Web (IIFE) bundle built: " + path.join(appWebDir, "bundle.js"));
  } catch (e) {
    console.warn(
      "[web] skipped web bundle build (non-fatal): " + (e?.message ?? e),
    );
  }

  console.log("Build complete.");
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
