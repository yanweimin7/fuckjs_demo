import 'package:flutter/material.dart';

import '../utils/extensions.dart';

class FuickNode {
  final int id;
  String type;
  bool isBoundary;
  Map<String, dynamic> props;
  List<FuickNode> children;

  FuickNode({
    required this.id,
    required this.type,
    required this.props,
    required this.children,
    this.isBoundary = false,
  });

  void update(
    Map<String, dynamic> newProps,
    List<FuickNode> newChildren,
    FuickNodeManager manager,
  ) {
    props = _processProps(newProps, manager);
    children = newChildren;
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
      if (type == 'flutter-props' ||
          type == 'FlutterProps' ||
          type == 'Props') {
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
      final node = manager.createNode(
        Map<String, dynamic>.from(value),
        manager,
      );
      return node;
    } else if (value is Map) {
      return value.map((k, v) => MapEntry(k, _findAndUpgradeNodes(v, manager)));
    } else if (value is List) {
      return value.map((e) => _findAndUpgradeNodes(e, manager)).toList();
    }
    return value;
  }
}

typedef FuickNodeListener = void Function(FuickNode node);

class FuickNodeManager {
  final Map<int, Set<FuickNodeListener>> _listeners = {};
  final Map<int, FuickNode> _nodes = {};

  void addListener(int id, FuickNodeListener listener) {
    _listeners.putIfAbsent(id, () => {}).add(listener);
  }

  void removeListener(int id, FuickNodeListener listener) {
    _listeners[id]?.remove(listener);
    if (_listeners[id]?.isEmpty ?? false) {
      _listeners.remove(id);
    }
  }

  void notify(int id, FuickNode node) {
    _nodes[id] = node;
    final callbacks = _listeners[id];
    if (callbacks != null) {
      for (final callback in List.from(callbacks)) {
        callback(node);
      }
    }
  }

  FuickNode createNode(Map<String, dynamic> dsl, FuickNodeManager manager) {
    final id = asInt(dsl['id']);
    final type = dsl['type'] as String;
    final isBoundary = dsl['isBoundary'] == true;
    final props = Map<String, dynamic>.from(dsl['props'] as Map? ?? {});
    final childrenDsl = (dsl['children'] as List?) ?? [];

    // 1. Recursively create children first
    final List<FuickNode> children = childrenDsl
        .map((c) => createNode(Map<String, dynamic>.from(c as Map), manager))
        .toList();

    // 2. Create new node
    FuickNode node = FuickNode(
      id: id,
      type: type,
      isBoundary: isBoundary,
      props: {},
      children: [],
    );

    // 3. Update props and children
    node.update(props, children, manager);

    // 4. Cache node
    _nodes[id] = node;

    return node;
  }

  ///为什么不采用dart端维护同样的vnode节点，js端只发送有更新的props的方案，因为js端可能触发节点顺序变化，一个listview，如果使用key，会造成key乱掉。维护逻辑变得很重。
  ///现在比较简单，js端算出最高那一层需要刷新的id，将全量children数据都传递过来，触发刷新
  void applyPatches(List<dynamic> patches, FuickNodeManager manager) {
    for (final patch in patches) {
      if (patch is! Map) continue;
      final dsl = Map<String, dynamic>.from(patch);
      final id = asInt(dsl['id']);

      if (_nodes.containsKey(id)) {
        final existingNode = _nodes[id]!;
        // If type matches, update in-place to preserve object reference
        if (existingNode.type == dsl['type']) {
          final props = Map<String, dynamic>.from(dsl['props'] as Map? ?? {});
          final childrenDsl = (dsl['children'] as List?) ?? [];

          // Recursively create new children (since children structure might change)
          final List<FuickNode> newChildren = childrenDsl
              .map(
                (c) => createNode(Map<String, dynamic>.from(c as Map), manager),
              )
              .toList();

          existingNode.update(props, newChildren, manager);
          manager.notify(id, existingNode);
          continue;
        }
      }

      // Create new node from patch DSL
      final newNode = createNode(dsl, manager);

      // Trigger UI refresh for the patched node with NEW node data
      manager.notify(id, newNode);
    }
  }

  void applyOps(List<dynamic> ops, FuickNodeManager manager) {
    int i = 0;
    while (i < ops.length) {
      final opCode = asInt(ops[i++]);
      if (opCode == 1) {
        // UPDATE: id, props
        final id = asInt(ops[i++]);
        final props = ops[i++] as Map;
        final node = _nodes[id];
        if (node != null) {
          final processed = node._processProps(
            Map<String, dynamic>.from(props),
            manager,
          );
          node.props.addAll(processed);
          manager.notify(id, node);
        }
      } else if (opCode == 2) {
        // INSERT: parentId, childId, index, childDsl
        final parentId = asInt(ops[i++]);
        final childId = asInt(ops[i++]);
        final index = asInt(ops[i++]);
        final childDsl = ops[i++];

        final parent = _nodes[parentId];
        if (parent != null) {
          // Ensure child is removed from old location/nodes if it existed (handled by explicit REMOVE op usually, but safety check?)
          // Usually REMOVE op comes before INSERT for moves.
          // But createNode will overwrite _nodes[childId].
          final childNode = createNode(
            Map<String, dynamic>.from(childDsl),
            manager,
          );

          if (index >= 0 && index <= parent.children.length) {
            parent.children.insert(index, childNode);
          } else {
            parent.children.add(childNode);
          }
          manager.notify(parentId, parent);
        }
      } else if (opCode == 3) {
        // REMOVE: parentId, childId
        final parentId = asInt(ops[i++]);
        final childId = asInt(ops[i++]);

        final parent = _nodes[parentId];
        if (parent != null) {
          parent.children.removeWhere((c) => c.id == childId);
          _removeNodeRecursive(childId);
          manager.notify(parentId, parent);
        }
      }
    }
  }

  void _removeNodeRecursive(int id) {
    final node = _nodes[id];
    if (node != null) {
      for (final child in node.children) {
        _removeNodeRecursive(child.id);
      }
      _nodes.remove(id);
      _listeners.remove(id);
    }
  }

  void clear() {
    _listeners.clear();
    _nodes.clear();
  }
}

class FuickNodeManagerProvider extends InheritedWidget {
  final FuickNodeManager manager;

  const FuickNodeManagerProvider({
    super.key,
    required this.manager,
    required super.child,
  });

  static FuickNodeManager? of(BuildContext context) {
    return context
        .dependOnInheritedWidgetOfExactType<FuickNodeManagerProvider>()
        ?.manager;
  }

  @override
  bool updateShouldNotify(FuickNodeManagerProvider oldWidget) {
    return manager != oldWidget.manager;
  }
}
