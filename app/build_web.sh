#!/usr/bin/env bash
#
# 构建 Web 产物 —— 默认编 dart2wasm。
#
# 用法:
#   ./build_web.sh                    # dart2wasm(默认);不支持的浏览器自动回退 main.dart.js
#   ./build_web.sh --js               # 强制 dart2js,只出 main.dart.js
#   ./build_web.sh --check            # 只做 --wasm-dry-run 编译检查,不产出
#   ./build_web.sh --strip-wasm       # 额外剥离 wasm 调试信息(产物更小,排错变难)
#   ./build_web.sh --out /tmp/web     # 指定输出目录(默认 build/web)
#   ./build_web.sh -- <额外参数>      # 其余参数原样透传给 flutter build web
#
# 为什么默认 wasm:见 fuickjs_framework/docs/flutter-web-support.md §2.1。
# wasm 产物不是"替换" JS —— Flutter 会同时产出 main.dart.wasm(+ .mjs) 与
# main.dart.js 回退件,由 flutter_bootstrap.js 在运行时探测 WebAssembly GC
# 支持后择优加载,无需接入方写任何分支。
#
# 前置:JS bundle 先构建(bundle.js / fuick-web-worker 由 esbuild 产出并拷进 app/web)
#   cd ../js && npm run build
#
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${APP_DIR}"

TARGET="lib/main_web.dart"
OUT_DIR="build/web"
MODE="wasm"
EXTRA=()

while [ $# -gt 0 ]; do
  case "$1" in
    --js)         MODE="js"; shift ;;
    --check)      MODE="check"; shift ;;
    --strip-wasm) EXTRA+=("--strip-wasm"); shift ;;
    --out)        OUT_DIR="${2:?--out 需要一个目录}"; shift 2 ;;
    -h|--help)    sed -n '2,20p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; exit 0 ;;
    --)           shift; EXTRA+=("$@"); break ;;
    *)            EXTRA+=("$1"); shift ;;
  esac
done

# flutter 解析顺序:显式 FLUTTER_BIN > PATH 里的 flutter > fvm(项目常用 fvm 锁版本)。
# 刻意不写死 SDK 绝对路径 —— 那是"换台机器就跑不起来"的经典来源。
FLUTTER="${FLUTTER_BIN:-}"
if [ -z "${FLUTTER}" ]; then
  if command -v flutter >/dev/null 2>&1; then
    FLUTTER="$(command -v flutter)"
  elif command -v fvm >/dev/null 2>&1; then
    FLUTTER="fvm flutter"
  else
    echo "ERROR: 找不到 flutter。装好 SDK 后重试,或用 FLUTTER_BIN 指定:" >&2
    echo "       FLUTTER_BIN=/path/to/flutter/bin/flutter $0" >&2
    exit 1
  fi
fi
echo "flutter: ${FLUTTER}"

# 版本前置校验:dart2wasm 需要较新的 SDK。太老会以一堆难懂的编译错误收场,
# 不如在这里明确失败。
VER_JSON="$(${FLUTTER} --version --machine 2>/dev/null || true)"
if [ -n "${VER_JSON}" ]; then
  echo "${VER_JSON}" | sed -n 's/.*"frameworkVersion": *"\([^"]*\)".*/Flutter \1/p' || true
fi

case "${MODE}" in
  wasm)
    # --wasm:编 dart2wasm(带 dart2js 回退件)。
    # 注意 dart2wasm 不支持 dart:html / dart:js / dart:js_util —— 依赖树里任何一个
    # web 插件还在用这三个库都会让编译失败。现行依赖已全部满足(见文档 §5)。
    set -x
    ${FLUTTER} build web --wasm --target "${TARGET}" --output "${OUT_DIR}" "${EXTRA[@]+"${EXTRA[@]}"}"
    ;;
  js)
    set -x
    ${FLUTTER} build web --target "${TARGET}" --output "${OUT_DIR}" "${EXTRA[@]+"${EXTRA[@]}"}"
    ;;
  check)
    # 只验证 wasm 是否编得过,不落产物 —— 依赖升级后快速回归用。
    set -x
    ${FLUTTER} build web --wasm-dry-run --target "${TARGET}" --output "${OUT_DIR}" "${EXTRA[@]+"${EXTRA[@]}"}"
    ;;
esac

echo
echo "✔ 构建完成: ${OUT_DIR}"
ls -la "${OUT_DIR}/main.dart.wasm" "${OUT_DIR}/main.dart.mjs" "${OUT_DIR}/main.dart.js" 2>/dev/null \
  | awk '{printf "  %-16s %10s bytes\n", $NF, $5}' | sed "s|${OUT_DIR}/||"
