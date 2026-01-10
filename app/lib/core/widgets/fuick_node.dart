import 'package:flutter/material.dart';

import 'widget_factory.dart';

class FuickNode extends ChangeNotifier {
  final int id;
  String type;
  bool isBoundary;
  Map<String, dynamic> props;
  List<FuickNode> children;
  FuickNode? parent;

  FuickNode({
    required this.id,
    required this.type,
    required this.props,
    required this.children,
    this.isBoundary = false,
    this.parent,
  });

  void update(
    Map<String, dynamic> newProps,
    List<FuickNode> newChildren,
    FuickNodeManager manager, {
    String? newType,
    bool? newIsBoundary,
  }) {
    bool typeChanged = newType != null && type != newType;
    bool boundaryChanged = newIsBoundary != null && isBoundary != newIsBoundary;
    bool propsChanged = !_isMapEqual(props, newProps);
    bool childrenChanged = !_isListEqual(children, newChildren);

    if (typeChanged) type = newType;
    if (boundaryChanged) isBoundary = newIsBoundary;

    if (propsChanged) {
      debugPrint('[Flutter] Node $id ($type) props changed');
      props = _processProps(newProps, manager);
    }

    if (childrenChanged) {
      debugPrint(
        '[Flutter] Node $id ($type) children changed: ${newChildren.length} items',
      );
      children = newChildren;
      // Update parent pointers for new children
      for (final child in children) {
        child.parent = this;
      }
    }

    if (propsChanged || childrenChanged || typeChanged || boundaryChanged) {
      notify();
    }
  }

  Map<String, dynamic> _processProps(
    Map<String, dynamic> rawProps,
    FuickNodeManager manager,
  ) {
    final Map<String, dynamic> processed = {};
    rawProps.forEach((key, value) {
      processed[key] = _findAndUpgradeNodes(value, manager);
    });
    return processed;
  }

  dynamic _findAndUpgradeNodes(dynamic value, FuickNodeManager manager) {
    if (value is Map && value.containsKey('id') && value.containsKey('type')) {
      final String type = value['type'];

      ///挂载到属性上的节点要解析出来 ， 比如  appBar={<AppBar title={<Text text="title" />} />}
      if (type == 'FlutterProps') {
        // Special handling for FlutterProps: extract and upgrade its children
        final childrenDsl = value['children'] as List?;
        if (childrenDsl == null || childrenDsl.isEmpty) return null;

        final upgradedChildren = childrenDsl
            .map((c) => _findAndUpgradeNodes(c, manager))
            .where((e) => e != null)
            .toList();

        if (upgradedChildren.isEmpty) return null;
        return upgradedChildren.length == 1
            ? upgradedChildren.first
            : upgradedChildren;
      }

      // 这是一个 DSL 节点，升级为 FuickNode
      final node = manager.getOrCreateNode(
        Map<String, dynamic>.from(value),
        manager,
      );
      node.parent = this;
      return node;
    } else if (value is Map) {
      return value.map((k, v) => MapEntry(k, _findAndUpgradeNodes(v, manager)));
    } else if (value is List) {
      return value.map((e) => _findAndUpgradeNodes(e, manager)).toList();
    }
    return value;
  }

  void notify() {
    debugPrint(
      '[Flutter] Node $id ($type) notify() called, hasListeners: $hasListeners',
    );
    if (hasListeners) {
      debugPrint('[Flutter] Node $id ($type) notifying listeners');
      notifyListeners();
    } else {
      debugPrint(
        '[Flutter] Node $id ($type) bubbling update to parent ${parent?.id}',
      );
      parent?.notify();
    }
  }

  bool _isMapEqual(Map a, Map b) {
    if (identical(a, b)) return true;
    if (a.length != b.length) return false;
    for (final key in a.keys) {
      if (!b.containsKey(key)) return false;
      if (a[key] != b[key]) {
        // Simple deep check for nested maps (like style)
        if (a[key] is Map && b[key] is Map) {
          if (!_isMapEqual(a[key], b[key])) return false;
        } else {
          return false;
        }
      }
    }
    return true;
  }

  bool _isListEqual(List a, List b) {
    if (identical(a, b)) return true;
    if (a.length != b.length) return false;
    for (int i = 0; i < a.length; i++) {
      if (a[i] != b[i]) return false;
    }
    return true;
  }
}

class FuickNodeManager {
  final Map<int, FuickNode> _nodes = {};

  FuickNode getOrCreateNode(
    Map<String, dynamic> dsl,
    FuickNodeManager manager,
  ) {
    final id = (dsl['id'] as num).toInt();
    final type = dsl['type'] as String;
    final isBoundary = dsl['isBoundary'] == true;
    final props = Map<String, dynamic>.from(dsl['props'] as Map? ?? {});
    final childrenDsl = (dsl['children'] as List?) ?? [];

    if (_nodes.containsKey(id)) {
      final node = _nodes[id]!;
      // Recursively get children before updating current node
      final children = childrenDsl
          .map((c) => getOrCreateNode(c as Map<String, dynamic>, manager))
          .toList();
      node.update(props, children, manager);
      return node;
    } else {
      // Create node first so children can refer to it if needed (though not needed yet)
      final node = FuickNode(
        id: id,
        type: type,
        isBoundary: isBoundary,
        props: {}, // Start empty
        children: [],
      );
      _nodes[id] = node;

      final children = childrenDsl
          .map((c) => getOrCreateNode(Map<String, dynamic>.from(c), manager))
          .toList();

      node.update(props, children, manager);
      return node;
    }
  }

  // 1. 删除环节 (Deletion)：

  // - 执行顺序 ：将删除操作（Removals）提前到最开始执行。这避免了在同一个 Patch 包中“先建后删”导致新节点被误杀的问题。
  // - 移动感知 (Move-Safe) ：在递归删除时，会自动检查子节点是否在本次更新的“保留名单”中。如果一个子节点只是从被删的父节点移动到了别处，它将不再会被错误地销毁。
  // 2. 更新环节 (Update)：

  // - 类型不匹配处理 ：增加了对 type 变化的检测。如果 ID 没变但类型变了（例如从 Container 变成 TextField ），代码现在会强制先销毁旧节点（释放 Controller 等资源）并创建全新节点，而不是简单的 update 。
  // - 属性与链接分离 ：继续保持两阶段处理（先确保节点存在，再建立父子引用），确保无论 Patch 顺序如何，父节点总能找到它的子节点。
  // 3. 增加环节 (Addition)：

  // - 资源清理 ：确保所有新增或因类型变化而重建的节点，在它们的老版本被删除时，都会触发 WidgetParser.dispose 。这保证了 TextEditingController 等有状态资源不会随时间推移而堆积。

  void applyPatches(List<dynamic> patches, FuickNodeManager manager) {
    final List<int> explicitRemovals = [];
    final List<Map<String, dynamic>> updates = [];

    // 1. 分类 Patch
    for (final patch in patches) {
      if (patch is Map) {
        final m = Map<String, dynamic>.from(patch);
        final id = (m['id'] as num).toInt();

        if (m['action'] == 'remove') {
          explicitRemovals.add(id);
        } else {
          updates.add(m);
        }
      }
    }

    // 2. 识别类型不匹配的情况，将其加入待删除列表
    for (final m in updates) {
      final id = (m['id'] as num).toInt();
      final newType = m['type'] as String? ?? 'Container';
      if (_nodes.containsKey(id) && _nodes[id]!.type != newType) {
        explicitRemovals.add(id);
      }
    }

    // 3. 优先执行删除逻辑（清理旧节点和资源）
    // 传入本次所有待更新或被引用的 ID，防止误删正在移动的节点
    final Set<int> idsToKeep = {};
    for (final m in updates) {
      idsToKeep.add((m['id'] as num).toInt());
      final childrenIds = (m['childrenIds'] as List?)?.map(
        (e) => (e as num).toInt(),
      );
      if (childrenIds != null) {
        idsToKeep.addAll(childrenIds);
      }
    }

    for (final id in explicitRemovals) {
      _removeNodeRecursive(id, idsToKeep);
    }

    // 4. 第一遍：确保所有更新的节点都已存在（创建占位）
    for (final m in updates) {
      final id = (m['id'] as num).toInt();
      if (!_nodes.containsKey(id)) {
        _nodes[id] = FuickNode(
          id: id,
          type: m['type'] as String? ?? 'Container',
          isBoundary: m['isBoundary'] == true,
          props: {},
          children: [],
        );
      }
    }

    // 5. 第二遍：更新属性并建立父子关联
    for (final m in updates) {
      final id = (m['id'] as num).toInt();
      final props = Map<String, dynamic>.from(m['props'] as Map? ?? {});
      final childrenIds =
          (m['childrenIds'] as List?)
              ?.map((e) => (e as num).toInt())
              .toList() ??
          [];

      final node = _nodes[id];
      if (node != null) {
        final children = childrenIds
            .map((cid) => _nodes[cid])
            .whereType<FuickNode>()
            .toList();

        node.update(
          props,
          children,
          manager,
          newType: m['type'] as String?,
          newIsBoundary: m['isBoundary'] as bool?,
        );
      }
    }
  }

  void _removeNodeRecursive(int id, [Set<int>? idsToKeep]) {
    // 如果该节点在本次更新中需要保留（说明是移动节点），则不执行删除
    if (idsToKeep != null && idsToKeep.contains(id)) {
      return;
    }

    final node = _nodes.remove(id);
    if (node != null) {
      // Notify parser to cleanup stateful resources (like TextEditingController)
      WidgetFactory().disposeNode(node.id, node.type);
      for (final child in node.children) {
        _removeNodeRecursive(child.id, idsToKeep);
      }
    }
  }

  void clear() {
    _nodes.clear();
  }
}
