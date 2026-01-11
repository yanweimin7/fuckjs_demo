import 'package:flutter/material.dart';

import 'fuick_node.dart';
import 'parsers/widget_parser.dart';
import 'parsers/column_parser.dart';
import 'parsers/row_parser.dart';
import 'parsers/text_parser.dart';
import 'parsers/container_parser.dart';
import 'parsers/scaffold_parser.dart';
import 'parsers/app_bar_parser.dart';
import 'parsers/button_parser.dart';
import 'parsers/text_field_parser.dart';
import 'parsers/switch_parser.dart';
import 'parsers/image_parser.dart';
import 'parsers/padding_parser.dart';
import 'parsers/sized_box_parser.dart';
import 'parsers/divider_parser.dart';
import 'parsers/single_child_scroll_view_parser.dart';
import 'parsers/icon_parser.dart';
import 'parsers/list_view_parser.dart';
import 'parsers/stack_parser.dart';
import 'parsers/positioned_parser.dart';
import 'parsers/opacity_parser.dart';
import 'parsers/center_parser.dart';
import 'parsers/expanded_parser.dart';
import 'parsers/flexible_parser.dart';
import 'parsers/gesture_detector_parser.dart';
import 'parsers/ink_well_parser.dart';
import 'parsers/circular_progress_indicator_parser.dart';
import 'parsers/safe_area_parser.dart';

class WidgetFactory {
  static final WidgetFactory _instance = WidgetFactory._internal();
  factory WidgetFactory() => _instance;
  WidgetFactory._internal() {
    _registerDefaultParsers();
  }

  final Map<String, WidgetParser> _parsers = {};

  void _registerDefaultParsers() {
    register(ColumnParser());
    register(RowParser());
    register(TextParser());
    register(ContainerParser());
    register(ScaffoldParser());
    register(AppBarParser());
    register(ButtonParser());
    register(TextFieldParser());
    register(SwitchParser());
    register(ImageParser());
    register(PaddingParser());
    register(SizedBoxParser());
    register(DividerParser());
    register(SingleChildScrollViewParser());
    register(IconParser());
    register(ListViewParser());
    register(StackParser());
    register(PositionedParser());
    register(OpacityParser());
    register(CenterParser());
    register(ExpandedParser());
    register(FlexibleParser());
    register(GestureDetectorParser());
    register(InkWellParser());
    register(CircularProgressIndicatorParser());
    register(SafeAreaParser());
  }

  void register(WidgetParser parser) {
    _parsers[parser.type] = parser;
  }

  void disposeNode(int id, String type) {
    _parsers[type]?.dispose(id);
  }

  Widget build(BuildContext context, dynamic dslOrNode) {
    if (dslOrNode is FuickNode) {
      return buildFromNode(context, dslOrNode);
    }
    if (dslOrNode is! Map) {
      return const SizedBox.shrink();
    }
    final dsl = Map<String, dynamic>.from(dslOrNode);
    final type = dsl['type'] as String? ?? 'Text';
    final props = Map<String, dynamic>.from(dsl['props'] as Map? ?? {});
    final children = (dsl['children'] as List?) ?? [];
    return buildInternal(context, type, props, children);
  }

  Widget buildFromNode(
    BuildContext context,
    FuickNode node, {
    bool forceWrap = false,
  }) {
    if (forceWrap || node.isBoundary) {
      return _FuickNodeWidget(node: node, factory: this);
    }
    return buildInternal(context, node.type, node.props, node.children);
  }

  Widget buildInternal(
    BuildContext context,
    String type,
    Map<String, dynamic> props,
    dynamic children,
  ) {
    // debugPrint('[WidgetFactory] building $type with props: $props');
    final parser = _parsers[type];
    if (parser != null) {
      return parser.parse(context, props, children, this);
    }

    // Default to Text parser if not found
    final textParser = _parsers['Text'];
    if (textParser != null) {
      return textParser.parse(context, props, children, this);
    }

    return const SizedBox.shrink();
  }

  List<Widget> buildChildren(BuildContext context, dynamic children) {
    if (children is List<FuickNode>) {
      final Set<int> seenIds = {};
      final List<Widget> widgets = [];
      for (final node in children) {
        if (seenIds.contains(node.id)) continue;
        widgets.add(buildFromNode(context, node));
        seenIds.add(node.id);
      }
      return widgets;
    } else if (children is List) {
      return children
          .map((e) => e != null ? build(context, e) : null)
          .whereType<Widget>()
          .toList();
    }
    return const [];
  }

  Widget buildFirstChild(BuildContext context, dynamic children) {
    if (children is List<FuickNode>) {
      return children.isEmpty
          ? const SizedBox.shrink()
          : buildFromNode(context, children.first);
    } else if (children is List) {
      return children.isEmpty
          ? const SizedBox.shrink()
          : build(context, children.first);
    }
    return const SizedBox.shrink();
  }
}

class _FuickNodeWidget extends StatefulWidget {
  final FuickNode node;
  final WidgetFactory factory;

  _FuickNodeWidget({required this.node, required this.factory})
      : super(key: ValueKey(node.id));

  @override
  State<_FuickNodeWidget> createState() => _FuickNodeWidgetState();
}

class _FuickNodeWidgetState extends State<_FuickNodeWidget> {
  FuickNodeManager? _manager;
  late FuickNode _currentNode;

  @override
  void initState() {
    super.initState();
    _currentNode = widget.node;
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final newManager = FuickNodeManagerProvider.of(context);
    if (_manager != newManager) {
      if (_manager != null) {
        _manager!.removeListener(_currentNode.id, _onNodeChanged);
      }
      _manager = newManager;
      if (_manager != null) {
        _manager!.addListener(_currentNode.id, _onNodeChanged);
      }
    }
  }

  @override
  void didUpdateWidget(_FuickNodeWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.node.id != widget.node.id) {
      if (_manager != null) {
        _manager!.removeListener(oldWidget.node.id, _onNodeChanged);
        _manager!.addListener(widget.node.id, _onNodeChanged);
      }
    }
    if (oldWidget.node != widget.node) {
      _currentNode = widget.node;
    }
  }

  @override
  void dispose() {
    if (_manager != null) {
      _manager!.removeListener(_currentNode.id, _onNodeChanged);
    }
    super.dispose();
  }

  void _onNodeChanged(FuickNode newNode) {
    if (mounted) {
      setState(() {
        _currentNode = newNode;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return widget.factory.buildInternal(
      context,
      _currentNode.type,
      _currentNode.props,
      _currentNode.children,
    );
  }
}
