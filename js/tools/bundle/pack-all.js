#!/usr/bin/env node
/**
 * 批量打包 demo app 全部内置 bundle，并生成 bundles.json。
 *
 *   node pack-all.js [--key tools/bundle/bundle_signing_key.pem] [--keyId demo-key]
 *
 * 前置：先运行 npm run bundle:keys；assets/js 下已有对应 .js/.qjc。
 */
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const ROOT = path.resolve(__dirname, "../..");
const APP_JS = path.resolve(ROOT, "../app/assets/js");
const ASSETS_ROOT = path.join(ROOT, "assets");
const KEY_DEFAULT = path.join(__dirname, "bundle_signing_key.pem");
const PACK = path.join(__dirname, "pack-bundle.js");

/** demo 首页展示的 bundle 列表（name 须与 assets/js/<name>.js 一致）。 */
const BUNDLES = [
  { name: "bundle", label: "示例", initialRoute: "/" },
  { name: "taro-demo", label: "Taro Demo", initialRoute: "/" },
  { name: "dart-demo", label: "Dart Demo", initialRoute: "/" },
  { name: "wallet_bundle", label: "Fuick Wallet", initialRoute: "/" },
  { name: "xiangqi", label: "象棋", initialRoute: "/" },
  { name: "game", label: "宇宙进化", initialRoute: "/" },
];

function sha256File(file) {
  return crypto
    .createHash("sha256")
    .update(fs.readFileSync(file))
    .digest("hex");
}

function parseArgs() {
  const args = {
    key: KEY_DEFAULT,
    keyId: "demo-key",
    version: "1.0.0",
    minAppVersion: "1.0.0",
  };
  for (let i = 2; i < process.argv.length; i++) {
    const a = process.argv[i];
    if (a === "--key") args.key = path.resolve(process.argv[++i]);
    else if (a === "--keyId") args.keyId = process.argv[++i];
    else if (a === "--version") args.version = process.argv[++i];
  }
  return args;
}

function main() {
  const { key, keyId, version, minAppVersion } = parseArgs();
  if (!fs.existsSync(key)) {
    console.error("私钥不存在，请先运行: npm run bundle:keys");
    process.exit(1);
  }

  const packages = [];
  const tmpOut = path.join(APP_JS, ".bundle-build");
  fs.mkdirSync(tmpOut, { recursive: true });

  for (const b of BUNDLES) {
    const jsPath = path.join(APP_JS, `${b.name}.js`);
    const qjcPath = path.join(APP_JS, `${b.name}.qjc`);
    const hasJs = fs.existsSync(jsPath);
    const hasQjc = fs.existsSync(qjcPath);
    if (!hasJs && !hasQjc) {
      console.warn(`SKIP ${b.name}: ${jsPath} / ${qjcPath} 均不存在`);
      continue;
    }

    const packArgs = [
      PACK,
      "--name",
      b.name,
      "--version",
      version,
      "--key",
      key,
      "--keyId",
      keyId,
      "--minAppVersion",
      minAppVersion,
      "--out",
      tmpOut,
    ];
    if (hasJs) packArgs.push("--js", jsPath);
    // 不打包 .qjc：本地 qjsc 不可用时字节码不会重编，若仍打进 zip，demo 会按
    // codeForm: qjc 优先加载旧字节码，导致 JS 改动不生效。统一只打 .js，
    // 由引擎在需要时回退到已验签的 bundle.js。
    if (hasQjc) {
      console.warn(
        `WARN ${b.name}: 跳过 .qjc，仅打包 .js（codeForm=js）`,
      );
    }
    // bundle 主包携带 demo 图片资源（images/ → zip 内 assets/images/）
    if (b.name === "bundle" && fs.existsSync(ASSETS_ROOT)) {
      packArgs.push("--assets", ASSETS_ROOT);
    }

    execFileSync(process.execPath, packArgs, { stdio: "inherit" });

    const zipSrc = path.join(tmpOut, `${b.name}-${version}.zip`);
    const zipDest = path.join(APP_JS, `${b.name}.zip`);
    fs.copyFileSync(zipSrc, zipDest);
    const sha256 = sha256File(zipDest);
    packages.push({
      name: b.name,
      version,
      sha256,
      minAppVersion,
      label: b.label,
      initialRoute: b.initialRoute,
    });
    console.log(`  -> ${zipDest} sha256=${sha256}`);
  }

  fs.rmSync(tmpOut, { recursive: true, force: true });

  // Merge: preserve existing bundles.json entries, only update the ones we just packed
  const bundlesJsonPath = path.join(APP_JS, "bundles.json");
  let existingPackages = [];
  if (fs.existsSync(bundlesJsonPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(bundlesJsonPath, "utf8"));
      existingPackages = existing.packages || [];
    } catch {
      /* ignore parse errors */
    }
  }
  // Replace entries that were just packed, keep the rest
  const packedNames = new Set(packages.map((p) => p.name));
  const merged = [
    ...existingPackages.filter((p) => !packedNames.has(p.name)),
    ...packages,
  ];

  fs.writeFileSync(
    bundlesJsonPath,
    JSON.stringify({ packages: merged }, null, 2) + "\n",
  );
  console.log(
    `\nWrote ${bundlesJsonPath} (${merged.length} packages, updated ${packages.length})`,
  );

  // bundle_signing_pub.b64 留在 tools/bundle/ 下作为 JS 端源（sign-latest.js、gen-keys.js 使用）。
  // 应用端不再单独存一份；公钥值直接写进 demo app 的 Dart const（offline_bootstrap.dart）。
}

main();
