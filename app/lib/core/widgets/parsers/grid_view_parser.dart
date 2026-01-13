import 'package:flutter/material.dart';
import 'package:flutter_quickjs/core/container/fuick_app_controller.dart';
import 'package:flutter_quickjs/core/container/fuick_page_view.dart';
import '../../service/fuick_command_bus.dart';
import '../fuick_state_widgets.dart';
import '../widget_factory.dart';
import '../widget_utils.dart';
import 'widget_parser.dart';

class GridViewParser extends WidgetParser {
  @override
  String get type => 'GridView';

  @override
  void dispose(int nodeId) {}

  @override
  void onCommand(String refId, String method, dynamic args) {}

  @override
  Widget parse(BuildContext context, Map<String, dynamic> props,
      dynamic children, WidgetFactory factory) {
    final String? refId = props['refId']?.toString();
    final dynamic cacheKey = props['cacheKey'];

    final gridDelegate = WidgetUtils.gridDelegate(props);

    return WidgetUtils.wrapPadding(
      props,
      FuickGridView(
        refId: refId,
        gridDelegate: gridDelegate,
        cacheKey: cacheKey,
        itemCount: (props['itemCount'] as num?)?.toInt(),
        shrinkWrap: props['shrinkWrap'] ?? true,
        physics: WidgetUtils.scrollPhysics(props['physics'] as String?),
        padding: WidgetUtils.edgeInsets(props['padding']),
        scrollDirection: WidgetUtils.axis(props['scrollDirection'] as String?),
        itemBuilder: (context, index) {
          final bool hasBuilder = props['hasBuilder'] ?? false;
          if (!hasBuilder || refId == null) return Container();

          final appScope = FuickAppScope.of(context);
          final pageScope = FuickPageScope.of(context);
          if (appScope == null || pageScope == null) return Container();

          // Check local cache first
          final state = FuickGridView.of(context);
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
  final ScrollPhysics? physics;
  final EdgeInsetsGeometry? padding;
  final Axis scrollDirection;
  final dynamic cacheKey;
  final List<Widget>? children;
  final Widget Function(BuildContext context, int index)? itemBuilder;
  final ControllerCallback<ScrollController>? onControllerCreated;
  final ControllerCallback<ScrollController>? onDispose;

  const FuickGridView({
    super.key,
    this.refId,
    this.itemCount,
    required this.gridDelegate,
    this.shrinkWrap = false,
    this.physics,
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

  static FuickGridViewState? of(BuildContext context) {
    return context.findAncestorStateOfType<FuickGridViewState>();
  }
}

class FuickGridViewState extends State<FuickGridView>
    with AutomaticKeepAliveClientMixin {
  late ScrollController _controller;
  ScrollController get controller => _controller;
  final Map<int, dynamic> _dslCache = {};
  FuickCommandBus? _commandBus;

  @override
  bool get wantKeepAlive => true;

  dynamic getCachedDsl(int index) => _dslCache[index];
  void setCachedDsl(int index, dynamic dsl) => _dslCache[index] = dsl;

  void forceUpdate() {
    if (mounted) {
      setState(() {});
    }
  }

  @override
  void initState() {
    super.initState();
    _controller = ScrollController();
    widget.onControllerCreated?.call(_controller);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _commandBus = FuickAppScope.of(context)?.commandBus;
    _unregisterCommandListener(widget.refId);
    _registerCommandListener();
  }

  void _registerCommandListener() {
    if (widget.refId != null && _commandBus != null) {
      _commandBus!.addListener(widget.refId!, _onCommand);
    }
  }

  void _unregisterCommandListener(String? refId) {
    if (refId != null && _commandBus != null) {
      _commandBus!.removeListener(refId, _onCommand);
    }
  }

  void _onCommand(String method, dynamic args) {
    if (!mounted) return;

    if (method == 'animateTo') {
      if (!_controller.hasClients) return;
      final double offset = (args['offset'] as num).toDouble();
      final int duration = (args['duration'] as num?)?.toInt() ?? 300;
      final String curveStr = args['curve']?.toString() ?? 'easeInOut';
      final curve = WidgetUtils.curve(curveStr);
      _controller.animateTo(
        offset,
        duration: Duration(milliseconds: duration),
        curve: curve,
      );
    } else if (method == 'jumpTo') {
      if (!_controller.hasClients) return;
      final double offset = (args['offset'] as num).toDouble();
      _controller.jumpTo(offset);
    } else if (method == 'updateItem') {
      final int? index = (args['index'] as num?)?.toInt();
      final dynamic dsl = args['dsl'];
      if (index != null && dsl != null) {
        setCachedDsl(index, dsl);
        forceUpdate();
      }
    }
  }

  @override
  void didUpdateWidget(FuickGridView oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.cacheKey != oldWidget.cacheKey) {
      setState(() {
        _dslCache.clear();
      });
    }
    if (widget.refId != oldWidget.refId) {
      _unregisterCommandListener(oldWidget.refId);
      _registerCommandListener();

      if (oldWidget.refId != null) {
        oldWidget.onDispose?.call(_controller);
      }
      if (widget.refId != null) {
        widget.onControllerCreated?.call(_controller);
      }
    }
  }

  @override
  void dispose() {
    _unregisterCommandListener(widget.refId);
    widget.onDispose?.call(_controller);
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    if (widget.itemBuilder != null && widget.itemCount != null) {
      return GridView.builder(
        controller: _controller,
        gridDelegate: widget.gridDelegate,
        itemCount: widget.itemCount,
        shrinkWrap: widget.shrinkWrap,
        physics: widget.physics,
        padding: widget.padding,
        scrollDirection: widget.scrollDirection,
        itemBuilder: widget.itemBuilder!,
      );
    }

    return GridView(
      controller: _controller,
      gridDelegate: widget.gridDelegate,
      shrinkWrap: widget.shrinkWrap,
      physics: widget.physics,
      padding: widget.padding,
      scrollDirection: widget.scrollDirection,
      children: widget.children ?? [],
    );
  }
}
