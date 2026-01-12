import 'package:flutter/material.dart';
import 'package:flutter_quickjs/core/container/fuick_app_controller.dart';
import 'package:flutter_quickjs/core/container/fuick_page_view.dart';
import '../fuick_state_widgets.dart';
import '../widget_factory.dart';
import '../widget_utils.dart';
import 'widget_parser.dart';

class GridViewParser extends WidgetParser {
  @override
  String get type => 'GridView';

  final Map<String, GlobalKey<FuickGridViewState>> _keys = {};

  @override
  void dispose(int nodeId) {}

  @override
  void onCommand(String refId, String method, dynamic args) {
    final state = _keys[refId]?.currentState;
    if (state == null) {
      debugPrint('GridViewParser: state not found for refId $refId');
      return;
    }

    final controller = state.controller;
    if (method == 'animateTo') {
      final double offset = (args['offset'] as num).toDouble();
      final int duration = (args['duration'] as num?)?.toInt() ?? 300;
      final String curveStr = args['curve']?.toString() ?? 'easeInOut';
      final curve = WidgetUtils.curve(curveStr);
      controller.animateTo(
        offset,
        duration: Duration(milliseconds: duration),
        curve: curve,
      );
    } else if (method == 'jumpTo') {
      final double offset = (args['offset'] as num).toDouble();
      controller.jumpTo(offset);
    }
  }

  @override
  Widget parse(BuildContext context, Map<String, dynamic> props,
      dynamic children, WidgetFactory factory) {
    final String? refId = props['refId']?.toString();
    final dynamic cacheKey = props['cacheKey'];

    if (refId != null && !_keys.containsKey(refId)) {
      _keys[refId] = GlobalKey<FuickGridViewState>();
    }

    final gridDelegate = WidgetUtils.gridDelegate(props);

    return WidgetUtils.wrapPadding(
      props,
      FuickGridView(
        key: refId != null ? _keys[refId] : null,
        refId: refId,
        gridDelegate: gridDelegate,
        cacheKey: cacheKey,
        itemCount: (props['itemCount'] as num?)?.toInt(),
        shrinkWrap: props['shrinkWrap'] ?? true,
        padding: WidgetUtils.edgeInsets(props['padding']),
        scrollDirection: WidgetUtils.axis(props['scrollDirection'] as String?),
        onDispose: () {
          if (refId != null) {
            _keys.remove(refId);
          }
        },
        itemBuilder: (context, index) {
          final bool hasBuilder = props['hasBuilder'] ?? false;
          if (!hasBuilder || refId == null) return Container();

          final appScope = FuickAppScope.of(context);
          final pageScope = FuickPageScope.of(context);
          if (appScope == null || pageScope == null) return Container();

          // Check local cache first
          final state = _keys[refId]?.currentState;
          if (state != null) {
            final cachedDsl = state.getCachedDsl(index);
            if (cachedDsl != null) {
              return factory.build(context, cachedDsl);
            }
          }

          final dslOrFuture =
              appScope.getItemDSL(pageScope.pageId, refId, index);

          return FuickItemDSLBuilder(
            dslOrFuture: dslOrFuture,
            builder: (context, dsl) {
              // Store in local cache when resolved
              if (state != null) {
                state.setCachedDsl(index, dsl);
              }
              return factory.build(context, dsl);
            },
          );
        },
        children: props['hasBuilder'] == true
            ? null
            : factory.buildChildren(context, children),
      ),
    );
  }
}

class FuickGridView extends StatefulWidget {
  final String? refId;
  final int? itemCount;
  final SliverGridDelegate gridDelegate;
  final bool shrinkWrap;
  final EdgeInsetsGeometry? padding;
  final Axis scrollDirection;
  final dynamic cacheKey;
  final List<Widget>? children;
  final Widget Function(BuildContext context, int index)? itemBuilder;
  final ControllerCallback<ScrollController>? onControllerCreated;
  final VoidCallback? onDispose;

  const FuickGridView({
    super.key,
    this.refId,
    this.itemCount,
    required this.gridDelegate,
    this.shrinkWrap = false,
    this.padding,
    this.scrollDirection = Axis.vertical,
    this.cacheKey,
    this.children,
    this.itemBuilder,
    this.onControllerCreated,
    this.onDispose,
  });

  @override
  State<FuickGridView> createState() => FuickGridViewState();
}

class FuickGridViewState extends State<FuickGridView> {
  late ScrollController _controller;
  ScrollController get controller => _controller;
  final Map<int, dynamic> _dslCache = {};

  dynamic getCachedDsl(int index) => _dslCache[index];
  void setCachedDsl(int index, dynamic dsl) => _dslCache[index] = dsl;

  @override
  void initState() {
    super.initState();
    _controller = ScrollController();
    widget.onControllerCreated?.call(_controller);
  }

  @override
  void didUpdateWidget(FuickGridView oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.cacheKey != oldWidget.cacheKey) {
      setState(() {
        _dslCache.clear();
      });
    }
  }

  @override
  void dispose() {
    widget.onDispose?.call();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (widget.itemBuilder != null && widget.itemCount != null) {
      return GridView.builder(
        controller: _controller,
        gridDelegate: widget.gridDelegate,
        itemCount: widget.itemCount,
        shrinkWrap: widget.shrinkWrap,
        padding: widget.padding,
        scrollDirection: widget.scrollDirection,
        itemBuilder: widget.itemBuilder!,
      );
    }

    return GridView(
      controller: _controller,
      gridDelegate: widget.gridDelegate,
      shrinkWrap: widget.shrinkWrap,
      padding: widget.padding,
      scrollDirection: widget.scrollDirection,
      children: widget.children ?? [],
    );
  }
}
