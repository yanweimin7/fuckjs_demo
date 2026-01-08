# FuickJS

FuickJS 是一个基于 **QuickJS** 引擎实现的 Flutter 动态化渲染框架。它允许开发者使用 **React** 语法编写业务逻辑和 UI，并通过 Flutter 原生组件进行高性能渲染。

**目前作为技术探索，用于跑通原理，分层、命名什么的比较乱**

## 核心特性

- **React 开发体验**: 使用熟悉的 React 语法、Hooks 和生命周期。
- **高性能渲染**: 并非使用 WebView，而是将 JS 描述的 UI 树通过 FFI 传递给 Flutter，映射为原生 Widget。
- **轻量级桥接**: 采用 Dart FFI 直接与 C 层 QuickJS 交互，避免了 JSON 序列化的开销。
- **动态更新**: JS 代码可动态下发，实现不发版即可更新 App 功能。
- 支持android 、ios 、macos多平台

## 效果预览

<p align="center">
  <img src="https://github.com/yanweimin7/fuickjs/raw/master/imgs/Screenshot_20260107_225623.png" width="30%" />
  <img src="https://github.com/yanweimin7/fuickjs/raw/master/imgs/Simulator%20Screenshot%20-%20iPhone%2015%20Pro%20-%202026-01-07%20at%2022.58.08.png" width="30%" />
  <img src="https://github.com/yanweimin7/fuickjs/raw/master/imgs/screenshot-20260107-230007.png" width="30%" />
</p>

## 项目结构

```text
fuickjs/
├── app/                # Flutter 侧代码 (Native 容器)
│   ├── lib/
│   │   ├── core/       # 核心逻辑 (渲染引擎、控制器、Handler)
│   │   ├── quickjs_ffi.dart # 底层 FFI 封装
│   │   └── main.dart   # 入口文件
│   └── assets/js/      # JS 产物存放目录
├── js/                 # JS 侧代码 (React 运行时)
│   ├── src/
│   │   ├── renderer.js # 自定义 React 渲染器
│   │   ├── hostConfig.js # 协调器配置
│   │   └── pages/      # 业务页面代码
│   └── esbuild.js      # 打包脚本
└── README.md           # 本文件
```

## 运行流程

1. **JS 打包**:
   在 `js` 目录下运行 `node esbuild.js`。脚本会编译 JS 代码并将 `bundle.js` 自动拷贝到 `app/assets/js/` 目录。
2. **Flutter 运行**:
   在 `app` 目录下运行 `flutter run`。Flutter 容器会启动 QuickJS 引擎，加载 `bundle.js`，并根据 JS 侧生成的 DSL 渲染 UI。

## 快速开始

### 1. 安装依赖
```bash
# JS 侧
cd js
npm install

# Flutter 侧
cd app
flutter pub get
```

### 2. 编译 JS
```bash
cd js
npm run build
```

### 3. 运行项目
使用 IDE 打开 `app` 目录，或在命令行运行：
```bash
cd app
flutter run
```

## 技术架构

- **Engine**: [QuickJS](https://bellard.org/quickjs/) (轻量级、高性能 JS 引擎)
- **Bridge**: Dart FFI (C-Style 接口调用)
- **Framework**: React (前端 UI 框架)
- **Renderer**: 自定义 Reconciler (DSL 转换器)
