#!/usr/bin/env node
/**
 * canonical JSON 的 golden vector —— 锁死 Node 签名侧与 Dart 验签侧的字节一致性。
 *
 *   node canonical-golden.js --write   # 用本文件的 canonicalize 重新生成 golden
 *   node canonical-golden.js           # 校验 golden 与当前实现一致（CI 用）
 *
 * Dart 侧 `RemotePackagesVerifier.canonicalize` 读同一份 golden 做断言，
 * 见 fuickjs_flutter/test/offline/canonical_json_golden_test.dart。
 *
 * 任何一侧改动 canonicalize 都会让另一侧的测试立刻变红 —— 这正是目的：
 * 两端产出一旦漂移，线上表现是「latest.json 签名恒不匹配、静默回落内置包」，
 * 没有 golden 的话极难定位。
 */
const fs = require('node:fs');
const path = require('node:path');

const { canonicalize } = require('./sign-latest.js');

const GOLDEN_PATH = path.resolve(
  __dirname,
  '../../../../fuickjs_framework/fuickjs_flutter/test/offline/fixtures/canonical_json_golden.json',
);

/** 每条 case 都对应一类曾经出过问题或容易出问题的输入。 */
const CASES = [
  {
    name: 'empty object',
    input: {},
  },
  {
    name: 'key sorting',
    input: { z: 1, a: 2, m: 3 },
  },
  {
    name: 'scalar types',
    input: { b: true, f: false, n: null, i: 42, d: 1.5, neg: -7 },
  },
  {
    name: 'typical packages payload',
    input: {
      packages: [
        {
          name: 'wallet_bundle',
          version: '1.2.3',
          sha256: 'a'.repeat(64),
          url: 'https://cdn.example.com/wallet_bundle-1.2.3.zip',
          mustBeUpdated: false,
        },
      ],
    },
  },
  {
    name: 'double quote in string',
    input: { s: 'say "hi"' },
  },
  {
    // 旧实现的实际 bug：Dart 侧漏转义单独出现的反斜杠，与 Node 产出不一致。
    name: 'lone backslash',
    input: { s: String.raw`C:\bundles\v1` },
  },
  {
    name: 'backslash followed by quote',
    input: { s: String.raw`a\"b` },
  },
  {
    name: 'control characters',
    input: { s: 'line1\nline2\tend\r\b\f\u0001' },
  },
  {
    name: 'non-ascii',
    input: { s: '中文 · emoji 🎉 · ümlaut' },
  },
  {
    name: 'keys needing escaping',
    input: { 'a"b': 1, 'c\\d': 2, 'e\nf': 3 },
  },
  {
    name: 'nested structures',
    input: {
      outer: { z: [1, 'two', null, { inner: true }], a: {} },
      list: [[], [[]]],
    },
  },
];

function build() {
  return CASES.map((c) => ({
    name: c.name,
    input: c.input,
    canonical: canonicalize(c.input),
  }));
}

function main() {
  const write = process.argv.includes('--write');
  const generated = build();

  if (write) {
    fs.mkdirSync(path.dirname(GOLDEN_PATH), { recursive: true });
    fs.writeFileSync(GOLDEN_PATH, JSON.stringify(generated, null, 2) + '\n');
    console.log(`Wrote ${generated.length} vectors → ${GOLDEN_PATH}`);
    return;
  }

  const golden = JSON.parse(fs.readFileSync(GOLDEN_PATH, 'utf8'));
  let failed = 0;
  for (const expected of golden) {
    const actual = canonicalize(expected.input);
    if (actual !== expected.canonical) {
      failed++;
      console.error(`FAIL ${expected.name}`);
      console.error(`  expected: ${expected.canonical}`);
      console.error(`  actual  : ${actual}`);
    }
  }
  if (golden.length !== generated.length) {
    failed++;
    console.error(
      `FAIL case count drifted: golden=${golden.length} cases=${generated.length}. ` +
        'Run with --write after reviewing.',
    );
  }
  if (failed > 0) {
    console.error(`\n${failed} golden vector(s) mismatched.`);
    process.exit(1);
  }
  console.log(`OK ${golden.length} canonical JSON golden vectors`);
}

main();
