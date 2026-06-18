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
    const files = [];
    let entry = null;
    let codeForm = null;

    if (args.qjc && fs.existsSync(args.qjc)) {
      const rel = copyAs(args.qjc, staging, 'bundle.qjc');
      files.push({ path: rel, sha256: sha256File(path.join(staging, rel)) });
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
      console.error('找不到代码文件 (--qjc 和/或 --js)');
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
      encryption: null,
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
