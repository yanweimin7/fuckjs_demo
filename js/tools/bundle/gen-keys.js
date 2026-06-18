#!/usr/bin/env node
/**
 * 生成 Ed25519 签名密钥对（用于 bundle manifest 签名）。
 *
 *   node gen-keys.js [outDir]
 *
 * 产物（默认输出到本目录）：
 *   - bundle_signing_key.pem   私钥（PKCS8 PEM）—— 后端签名服务持有，切勿入库
 *   - bundle_signing_pub.pem   公钥（SPKI PEM）
 *   - bundle_signing_pub.b64   公钥原始 32 字节的 base64 —— 内置进 App（OfflineConfig.signaturePublicKeysB64）
 */
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const outDir = process.argv[2] ? path.resolve(process.argv[2]) : __dirname;

function rawPublicKeyB64(publicKey) {
  // Ed25519 公钥的原始 32 字节存于 JWK 的 x（base64url）。
  const jwk = publicKey.export({ format: 'jwk' });
  return Buffer.from(jwk.x, 'base64url').toString('base64');
}

function main() {
  const { privateKey, publicKey } = crypto.generateKeyPairSync('ed25519');

  const privPem = privateKey.export({ type: 'pkcs8', format: 'pem' });
  const pubPem = publicKey.export({ type: 'spki', format: 'pem' });
  const pubB64 = rawPublicKeyB64(publicKey);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'bundle_signing_key.pem'), privPem);
  fs.writeFileSync(path.join(outDir, 'bundle_signing_pub.pem'), pubPem);
  fs.writeFileSync(path.join(outDir, 'bundle_signing_pub.b64'), pubB64);

  console.log('Ed25519 key pair generated at:', outDir);
  console.log('  private : bundle_signing_key.pem (keep secret, do NOT commit)');
  console.log('  public  : bundle_signing_pub.pem');
  console.log('  app key : bundle_signing_pub.b64 ->', pubB64);
}

main();
