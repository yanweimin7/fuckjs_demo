const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");
const { execSync, execFileSync } = require("child_process");

const watch = process.argv.includes("--watch");

// qjsc 编译器路径（可选，不存在时跳过字节码编译）
const QJSC_PATH = path.resolve(
  __dirname,
  "../../fuickjs_engine/src/main/jni/quickjs/build_macos/qjsc",
);

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
    sourcemap: !isProd || process.env.SOURCEMAP === 'true',
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
      "@tarojs/components-fuickjs": path.resolve(
        __dirname,
        "../../taro-fuickjs/packages/components-fuickjs/dist/index.js",
      ),
      "@tarojs/taro-fuickjs": path.resolve(
        __dirname,
        "../../taro-fuickjs/packages/taro-fuickjs/dist/index.js",
      ),
      "taro-css-to-fuickjs/runtime": path.resolve(
        __dirname,
        "../../taro-fuickjs/packages/taro-css-to-fuickjs/dist/runtime.js",
      ),
      "taro-css-to-fuickjs": path.resolve(
        __dirname,
        "../../taro-fuickjs/packages/taro-css-to-fuickjs/dist/index.js",
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
  const destBin = path.join(destDir, "bundle.qjc");

  fs.copyFileSync(src, dest);
  console.log(`Copied bundle to ${dest}`);

  if (fs.existsSync(QJSC_PATH)) {
    console.log("Compiling bundle to QuickJS bytecode...");
    execSync(`${QJSC_PATH} -b -o ${destBin} ${src}`);
    console.log(`Compiled to ${destBin}`);
  }

  // Pack all bundles into zip files — skip in debug mode（SOURCEMAP 时不需要 zip）
  if (process.env.SOURCEMAP !== 'true') {
    console.log("\nPacking bundles...");
    const packAll = path.resolve(__dirname, "tools/bundle/pack-all.js");
    execFileSync(process.execPath, [packAll], { stdio: "inherit", cwd: __dirname });
  }

  console.log("Build complete.");
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
