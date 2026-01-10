import 'package:flutter/material.dart';

class FuickNode extends ChangeNotifier {
  final int id;
  final String type;
  final bool isBoundary;
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

  void update(Map<String, dynamic> newProps, List<FuickNode> newChildren) {
    bool propsChanged = !_isMapEqual(props, newProps);
    bool childrenChanged = !_isListEqual(children, newChildren);

    if (propsChanged) {
      // debugPrint('[Flutter] Node $id ($type) props changed: $newProps');
      props = newProps;
    }
    if (childrenChanged) {
      // debugPrint(
      //     '[Flutter] Node $id ($type) children changed: ${newChildren.length} items');
      children = newChildren;
      // Update parent pointers for new children
      for (final child in children) {
        child.parent = this;
      }
    }

    if (propsChanged || childrenChanged) {
      notify();
    }
  }

  void notify() {
    if (hasListeners) {
      // debugPrint('[Flutter] Node $id ($type) notifying listeners');
      notifyListeners();
    } else {
      // debugPrint(
      //     '[Flutter] Node $id ($type) bubbling update to parent ${parent?.id}');
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
      node.update(props, children);
      return node;
    } else {
      // Create node first so children can refer to it if needed (though not needed yet)
      final node = FuickNode(
        id: id,
        type: type,
        isBoundary: isBoundary,
        props: props,
        children: [],
      );
      _nodes[id] = node;

      final children = childrenDsl
          .map((c) => getOrCreateNode(Map<String, dynamic>.from(c), manager))
          .toList();

      node.children = children;
      for (final child in children) {
        child.parent = node;
      }
      return node;
    }
  }

  void applyPatches(List<dynamic> patches, FuickNodeManager manager) {
    for (final patch in patches) {
      if (patch is Map) {
        final m = Map<String, dynamic>.from(patch);
        final id = (m['id'] as num).toInt();
        // isBoundary is usually fixed for a node, but could theoretically change
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
          node.update(props, children);
        }
      }
    }
  }

  void clear() {
    _nodes.clear();
  }
}
