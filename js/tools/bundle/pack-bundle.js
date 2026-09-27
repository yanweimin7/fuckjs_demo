#!/usr/bin/env node
/**
 * 打包并签名一个 bundle zip。
 *
 *   node pack-bundle.js \
 *     --name wallet_bundle --version 1.2.0 \
 *     --key ./bundle_signing_key.pem --keyId key-2026-01 \
 *     --minAppVersion 3.0.0 \
 *     --qjc ../../../app/assets/js/wallet_bundle.qjc \
 *     --js  ../../../app/assets/js/wallet_bundle.js \
 *     --assets ../../../app/assets/js/assets \
 *     --out ./dist
 *
 * 产物：<out>/<name>-<version>.zip
 *   zip 内：manifest.json + manifest.sig + bundle.qjc/bundle.js + assets/（图片不入 manifest、不加密）
 * 同时打印整包 SHA-256，供版本元数据接口下发。
 */
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const os = require('node:os');

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const val = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
      args[key] = val;
    }
  }
  return args;
}

function sha256File(file) {
  const buf = fs.readFileSync(file);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

// zip 会把每个条目的 mtime 写进 local header 和 central directory，因此同一份
// 源码在不同时间打包会得到不同的 zip sha256。这不是无害的：zip sha256 就是端上
// 的缓存目录名（<name>-<version>-<sha>/），一旦漂移，所有用户本地已编译好的
// .qjc 字节码缓存全部失效并重新下载，而内容其实一模一样。
//
// 打包前把 staging 内所有文件与目录的 mtime 归一，使相同内容 → 相同 sha256。
//
// 取本地时间的 1980-01-02 12:00：Info-ZIP 按本地墙钟写 DOS 时间戳，所以结果与
// 时区无关；选 12:00 而非 00:00 是为了远离 DOS 纪元下界（UTC+14 下 00:00 会退到
// 1979-12-31，越界后 zip 会钳位或告警）。
const STAMP = new Date(1980, 0, 2, 12, 0, 0);

function normalizeMtimes(dir) {
  // 先递归处理子项，最后再改 dir 自身——写入子项会刷新父目录 mtime。
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) normalizeMtimes(p);
    else fs.utimesSync(p, STAMP, STAMP);
  }
  fs.utimesSync(dir, STAMP, STAMP);
}

function copyAs(src, destDir, destName) {
  fs.mkdirSync(destDir, { recursive: true });
  const dest = path.join(destDir, destName);
  fs.copyFileSync(src, dest);
  return destName;
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else if (entry.isFile()) fs.copyFileSync(s, d);
  }
}

function main() {
  const args = parseArgs(process.argv);
  const name = args.name;
  const version = args.version;
  if (!name || !version) {
    console.error('Required: --name <name> --version <version>');
    process.exit(1);
  }
  const keyId = args.keyId || null;
  const minAppVersion = args.minAppVersion || null;
  const outDir = path.resolve(args.out || './dist');

  // 1. 准备 staging。
  const staging = fs.mkdtempSync(path.join(os.tmpdir(), 'fuick-bundle-'));
  try {
    // 2. zip 内代码文件统一命名为 bundle.qjc / bundle.js（与包 name 无关）。
    //    manifest.files 只收录 .js：.qjc 是 QuickJS 字节码，可能是本地编译的
    //    （引擎版本升级后 BundleCompiler 重新编译），sha256 不固定，不参与验签。
    //    .qjc 被篡改不会执行恶意代码——字节码格式不匹配时引擎加载失败 →
    //    回退到已验签的 bundle.js。.js 必须存在，作为验签与回退基准。
    const files = [];
    let entry = null;
    let codeForm = null;

    if (args.qjc && fs.existsSync(args.qjc)) {
      copyAs(args.qjc, staging, 'bundle.qjc');
      entry = 'bundle.qjc';
      codeForm = 'qjc';
    }
    if (args.js && fs.existsSync(args.js)) {
      const rel = copyAs(args.js, staging, 'bundle.js');
      files.push({ path: rel, sha256: sha256File(path.join(staging, rel)) });
      if (!entry) {
        entry = 'bundle.js';
        codeForm = 'js';
      }
    }
    if (files.length === 0) {
      console.error('找不到代码文件（--js 必填，作为验签与回退基准）');
      process.exit(1);
    }

    // 3. copy 资源（不入 manifest）。
    if (args.assets && fs.existsSync(args.assets)) {
      copyDir(args.assets, path.join(staging, 'assets'));
    }

    // 4. 写 manifest.json（只声明代码）。
    const manifest = {
      name,
      version,
      minAppVersion,
      keyId,
      entry,
      codeForm,
      files,
    };
    const manifestStr = JSON.stringify(manifest, null, 2);
    fs.writeFileSync(path.join(staging, 'manifest.json'), manifestStr);

    // 5. 签名 manifest.json（可选）。
    if (args.key) {
      const privPem = fs.readFileSync(path.resolve(args.key), 'utf8');
      const privateKey = crypto.createPrivateKey(privPem);
      const sig = crypto.sign(null, Buffer.from(manifestStr), privateKey);
      fs.writeFileSync(path.join(staging, 'manifest.sig'), sig.toString('base64'));
    } else {
      console.warn('WARN: 未提供 --key，跳过签名（仅 SHA-256 完整性）');
    }

    // 6. 打 zip（根级条目，无包裹目录）。
    fs.mkdirSync(outDir, { recursive: true });
    const zipPath = path.join(outDir, `${name}-${version}.zip`);
    if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
    normalizeMtimes(staging);
    execFileSync('zip', ['-r', '-X', '-q', zipPath, '.'], { cwd: staging });

    // 7. 整包 SHA-256。
    const zipSha256 = sha256File(zipPath);
    console.log('Bundle packed:', zipPath);
    console.log('  version      :', version);
    console.log('  codeForm     :', codeForm);
    console.log('  zip sha256   :', zipSha256);
    console.log('\n版本元数据示例：');
    console.log(
      JSON.stringify(
        { name, version, sha256: zipSha256, url: `https://YOUR_CDN/${name}-${version}.zip`, minAppVersion },
        null,
        2,
      ),
    );
  } finally {
    fs.rmSync(staging, { recursive: true, force: true });
  }
}

main();
