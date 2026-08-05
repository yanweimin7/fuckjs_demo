#!/usr/bin/env node
/**
 * 为 P0-5 远程 packages 列表 (latest.json) 生成 Ed25519 签名。
 *
 *   node sign-latest.js \
 *     --in  ./bundles.json \
 *     --out ./latest.json \
 *     --key ./bundle_signing_key.pem \
 *     --keyId demo-key
 *
 * 输入：bundles.json 格式（demo 现成的）：
 *   { "packages": [ { "name": "...", "version": "...", "sha256": "...",
 *                      "url": "...", "minAppVersion": "..." }, ... ] }
 *
 * 输出：latest.json（与 _fetchRemotePackages 返回结构一致）：
 *   {
 *     "_sig": "<base64 Ed25519 sig>",
 *     "_kid": "demo-key",
 *     "packages": [ ...原 packages... ]
 *   }
 *
 * 签名载荷：剥离 _sig/_kid 后剩余字段按 key 排序、无空白的 canonical JSON 字节。
 * 客户端 RemotePackagesVerifier 的 _canonicalize 必须与此一致。
 */
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

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

function escape(s) {
  return s.replaceAll('\\', '\\\\').replaceAll('"', '\\"');
}

function encodeValue(v) {
  if (v === null) return 'null';
  if (typeof v === 'boolean') return v.toString();
  if (typeof v === 'number') return v.toString();
  if (typeof v === 'string') return `"${escape(v)}"`;
  if (Array.isArray(v)) return `[${v.map(encodeValue).join(',')}]`;
  if (typeof v === 'object') return canonicalize(v);
  return `"${escape(String(v))}"`;
}

function canonicalize(obj) {
  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => `"${escape(k)}":${encodeValue(obj[k])}`).join(',')}}`;
}

function main() {
  const args = parseArgs(process.argv);
  const inputFile = args.in;
  const outputFile = args.out;
  const keyFile = args.key;
  const keyId = args.keyId;

  if (!inputFile || !outputFile || !keyFile || !keyId) {
    console.error('Required: --in <bundles.json> --out <latest.json> --key <pem> --keyId <id>');
    process.exit(1);
  }

  const input = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  const payload = { packages: input.packages || [] };

  const canonical = canonicalize(payload);
  const privPem = fs.readFileSync(keyFile, 'utf8');
  const privateKey = crypto.createPrivateKey(privPem);
  const sig = crypto.sign(null, Buffer.from(canonical), privateKey);

  const signed = {
    _sig: sig.toString('base64'),
    _kid: keyId,
    ...payload,
  };

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, JSON.stringify(signed, null, 2) + '\n');

  console.log(`Signed ${outputFile}`);
  console.log(`  packages: ${payload.packages.length}`);
  console.log(`  keyId   : ${keyId}`);
  console.log(`  _sig    : ${signed._sig.slice(0, 32)}...`);
}

main();
