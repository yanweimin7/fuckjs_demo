const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const watch = process.argv.includes("--watch");

// qjsc 编译器路径（可选，不存在时跳过字节码编译）
const QJSC_PATH = path.resolve(
  __dirname,
  "../../fuickjs_engine/src/main/jni/quickjs/build/qjsc",
);

async function build() {
  const isProd = !watch;
  const reactPath = isProd
    ? "node_modules/react/cjs/react.production.min.js"
    : "node_modules/react/cjs/react.development.js";
  const reconcilerPath = isProd
    ? "node_modules/react-reconciler/cjs/react-reconciler.production.min.js"
    : "node_modules/react-reconciler/cjs/react-reconciler.development.js";
  const schedulerPath = isProd
    ? "node_modules/scheduler/cjs/scheduler.production.min.js"
    : "node_modules/scheduler/cjs/scheduler.development.js";

  const commonOptions = {
    bundle: true,
    platform: "neutral",
    format: "esm",
    target: "es2020",
    minify: true,
    sourcemap: !isProd,
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

  console.log("Build complete.");
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
