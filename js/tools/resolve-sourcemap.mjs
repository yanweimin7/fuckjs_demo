/**
 * resolve-sourcemap.mjs
 *
 * 线上 JS 错误 sourcemap 还原工具。
 *
 * 用法：
 *   node tools/resolve-sourcemap.mjs <mapFile> <line> <column>
 *
 * 示例：
 *   node tools/resolve-sourcemap.mjs dist/bundle.js.map 1234 56
 *
 * 或者传入完整 stack trace（从文件读取）：
 *   node tools/resolve-sourcemap.mjs dist/bundle.js.map --stack stack.txt
 *
 * stack.txt 格式（Flutter 上报的原始 stack）：
 *   TypeError: Cannot read property 'foo' of undefined
 *       at handleTap (bundle.js:1234:56)
 *       at dispatchEvent (bundle.js:5678:12)
 *       at render (bundle.js:9012:34)
 */

import { readFileSync } from 'fs';
import { SourceMapConsumer } from 'source-map';

// ---- 解析命令行参数 --------------------------------------------------------

const args = process.argv.slice(2);

if (args.length < 2) {
  console.log(`
用法:
  node tools/resolve-sourcemap.mjs <mapFile> <line> <column>
  node tools/resolve-sourcemap.mjs <mapFile> --stack <stackFile>
  node tools/resolve-sourcemap.mjs <mapFile> --text "at fn (bundle.js:123:45)"
  `);
  process.exit(1);
}

const mapFile = args[0];

// ---- 加载 sourcemap --------------------------------------------------------

let rawMap;
try {
  rawMap = readFileSync(mapFile, 'utf8');
} catch {
  console.error(`❌ 找不到 sourcemap 文件: ${mapFile}`);
  console.error('   请确认 esbuild 构建时开启了 sourcemap: true');
  process.exit(1);
}

// ---- 核心还原函数 ----------------------------------------------------------

async function resolvePosition(consumer, line, column) {
  const pos = consumer.originalPositionFor({
    line: Number(line),
    column: Number(column),
  });

  if (!pos.source) {
    return null;
  }

  return {
    source: pos.source.replace(/^.*\/src\//, 'src/'), // 缩短路径
    line: pos.line,
    column: pos.column,
    name: pos.name,
  };
}

// ---- stack trace 解析 ------------------------------------------------------

// 匹配 "at xxx (bundle.js:LINE:COL)" 或 "at bundle.js:LINE:COL"
const STACK_RE = /at\s+(?:(\S+)\s+)?\(?(?:\S+\.js):(\d+):(\d+)\)?/g;

async function resolveStack(consumer, stackText) {
  const lines = stackText.split('\n');
  const results = [];

  for (const line of lines) {
    // 尝试匹配 stack frame
    const match = STACK_RE.exec(line);
    STACK_RE.lastIndex = 0; // 重置 global regex

    if (!match) {
      // 非 stack frame 行（错误消息等），原样保留
      results.push({ original: line.trim(), resolved: null });
      continue;
    }

    const [, fnName, lineNum, colNum] = match;
    const pos = await resolvePosition(consumer, lineNum, colNum);

    results.push({
      original: line.trim(),
      fnName: pos?.name || fnName || '(anonymous)',
      resolved: pos,
    });
  }

  return results;
}

// ---- 格式化输出 -------------------------------------------------------------

function formatResult(results) {
  console.log('\n' + '─'.repeat(60));
  console.log('📍 Sourcemap 还原结果');
  console.log('─'.repeat(60));

  for (const r of results) {
    if (!r.resolved) {
      // 原样打印（错误消息行）
      if (r.original) console.log(`  ${r.original}`);
      continue;
    }

    const { source, line, column, name } = r.resolved;
    const fnName = name || r.fnName;
    console.log(`  at ${fnName} (${source}:${line}:${column})`);
    console.log(`  ${'  '}← 原始: ${r.original}`);
    console.log();
  }

  console.log('─'.repeat(60));
}

// ---- 主流程 ----------------------------------------------------------------

async function main() {
  const consumer = await new SourceMapConsumer(rawMap);

  try {
    if (args[1] === '--stack') {
      // 从文件读取 stack trace
      const stackFile = args[2];
      if (!stackFile) {
        console.error('❌ 请提供 stack 文件路径');
        process.exit(1);
      }
      const stackText = readFileSync(stackFile, 'utf8');
      const results = await resolveStack(consumer, stackText);
      formatResult(results);

    } else if (args[1] === '--text') {
      // 直接传入 stack 文本
      const stackText = args[2];
      const results = await resolveStack(consumer, stackText);
      formatResult(results);

    } else {
      // 单行列号还原
      const line = args[1];
      const column = args[2] || '0';
      const pos = await resolvePosition(consumer, line, column);

      if (!pos) {
        console.log(`❌ 无法还原位置 ${line}:${column}`);
        console.log('   可能原因：行列号超出范围，或 sourcemap 不完整');
      } else {
        console.log('\n📍 还原结果:');
        console.log(`   bundle.js:${line}:${column}`);
        console.log(`   ↓`);
        console.log(`   ${pos.source}:${pos.line}:${pos.column}${pos.name ? ` (${pos.name})` : ''}`);
      }
    }
  } finally {
    consumer.destroy();
  }
}

main().catch(err => {
  console.error('❌ 还原失败:', err.message);
  process.exit(1);
});
