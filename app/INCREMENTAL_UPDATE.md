# FuickJS 增量更新机制详解

本文档详细介绍了 FuickJS 框架中增量更新（Incremental Update）的设计与实现逻辑。增量更新旨在解决复杂页面（特别是包含长列表的页面）在数据变更时全量重新渲染带来的性能瓶颈。

## 1. 概述

在传统的“全量更新（Dirty Mode）”模式下，React 树的任何变化都会导致整个页面的 DSL（Domain Specific Language）被重新生成并发送给 Flutter。对于简单的页面，这很快；但对于包含大量节点的页面（如长列表），序列化和传输整个 DSL 树会带来显著的性能开销。

**增量更新（Incremental Mode）** 通过只传输发生变化的节点指令（如“更新节点 A 的属性”、“在节点 B 下插入节点 C”），极大地减少了数据传输量和 Flutter 侧的重建工作。

## 2. 核心架构

增量更新的数据流向如下：

```mermaid
graph LR
    React[React Reconciler] -->|diffProps| HostConfig[hostConfig.ts]
    HostConfig -->|updatePayload| PageContainer[PageContainer.ts]
    PageContainer -->|OpCode| MutationQueue[mutationQueue]
    MutationQueue -->|dartCallNative| Flutter[Flutter Engine]
    Flutter -->|applyOps| NodeManager[FuickNodeManager]
    NodeManager -->|notify| Widget[FuickNodeWidget]
```

### 关键组件

1.  **JS 侧**:
    *   `hostConfig.ts`: React Reconciler 的适配层，负责比较新旧属性（Diffing）。
    *   `PageContainer.ts`: 页面容器，负责维护节点树状态，并收集变更指令（Mutation Queue）。
2.  **通信层**:
    *   `patchOps`: 一个扁平化的数组，包含了一系列的操作指令。
3.  **Flutter 侧**:
    *   `FuickAppController`: 接收 JS 指令的入口。
    *   `FuickNodeManager`: 解析指令并更新内存中的 `FuickNode` 树。

## 3. 实现细节

### 3.1 变更检测 (Diffing)

在 `hostConfig.ts` 的 `diffProps` 函数中，框架会比较 `oldProps` 和 `newProps`：

*   **属性比较**: 逐个比较 key-value。
*   **特殊处理 (`itemBuilder`)**:
    *   `itemBuilder` 是 `ListView` 的核心属性，它是一个函数。
    *   在增量模式下，如果 `itemBuilder` 的引用发生变化（例如因为 `useState` 导致组件重绘，生成了新的闭包），框架必须将其识别为 DSL 结构的变更。
    *   **修复逻辑**: 代码中显式检查了 `key === 'itemBuilder'`，并强制设置 `hasDslChanges = true`，确保 Flutter 侧能感知到列表数据源的变化。

```typescript
// fuick_js_framework/src/hostConfig.ts

if (key === 'itemBuilder') {
  hasDslChanges = true; // 强制标记为结构变更
}
```

### 3.2 指令记录 (Recording)

当检测到变化时，`PageContainer` 会将操作记录到 `mutationQueue`。为了性能，队列是一个扁平数组，而不是对象数组。

OpCode 定义：
*   `1`: **UPDATE** (更新属性)
*   `2`: **INSERT** (插入子节点)
*   `3`: **REMOVE** (移除子节点)

**示例队列**: `[1, 101, {text: "New Text"}, 3, 100, 105]`
(含义: 更新 ID 为 101 的节点属性；从 ID 100 的父节点移除 ID 105 的子节点)

### 3.3 提交更新 (Committing)

在 React 的 `commitUpdate` 或 `commitMount` 阶段结束后，`PageContainer.commit()` 会被调用：

```typescript
// fuick_js_framework/src/PageContainer.ts

public commit() {
  if (this.incrementalMode) {
    if (this.mutationQueue.length > 0) {
      dartCallNative('patchOps', {
        pageId: this.pageId,
        ops: this.mutationQueue
      });
      this.mutationQueue = [];
    }
  }
  // ... Dirty Mode fallback
}
```

### 3.4 Flutter 侧应用 (Applying)

Flutter 端的 `FuickNodeManager` (位于 `fuick_node.dart`) 接收并解析 `patchOps`：

```dart
// app/lib/core/widgets/fuick_node.dart

void applyOps(List<dynamic> ops, FuickNodeManager manager) {
  int i = 0;
  while (i < ops.length) {
    final opCode = ops[i++];
    if (opCode == 1) {
      // UPDATE: 读取 id 和 props，更新 FuickNode.props
      // 调用 manager.notify(id, node) 触发局部刷新
    } else if (opCode == 2) {
      // INSERT: 读取 parentId, childId, index, childDsl
      // 创建新节点并插入到 parent.children
    } else if (opCode == 3) {
      // REMOVE: 读取 parentId, childId
      // 从 parent.children 移除
    }
  }
}
```

## 4. 列表更新的特殊性

对于 `ListView`，FuickJS 采用了一种混合策略：

1.  **容器更新**: `ListView` 本身是一个普通的 `FuickNode`。当 `itemCount` 或 `itemBuilder` 变化时，通过 `patchOps` (OpCode 1) 更新 `ListView` 的属性。
2.  **子项渲染**: `ListView` 的子项（Items）**不**包含在初始的 DSL 或增量更新包中。
3.  **按需加载**:
    *   Flutter 端的 `ListView.builder` 在滚动时回调。
    *   Flutter 通过 `getItemDSL` 接口同步/异步调用 JS 端的 `itemBuilder` 函数。
    *   JS 返回该特定 Item 的 DSL。

这种设计使得 FuickJS 能够高效地处理无限列表，而无需一次性序列化所有数据。

## 5. 总结

增量更新通过 **Diff (JS) -> Patch (Bridge) -> Apply (Flutter)** 的管道，实现了细粒度的 UI 更新。
*   **优势**: 传输数据量小，Flutter 侧重绘范围小（只重绘受影响的 Widget）。
*   **关键点**: 正确处理函数引用变化（如 `itemBuilder`），确保逻辑变更能正确触发 UI 刷新。
