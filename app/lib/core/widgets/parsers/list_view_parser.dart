import 'package:flutter/material.dart';
import 'package:flutter_quickjs/core/container/fuick_app_controller.dart';
import 'package:flutter_quickjs/core/container/fuick_page_view.dart';
import 'package:flutter_quickjs/core/service/fuick_command_bus.dart';
import 'package:flutter_quickjs/core/widgets/fuick_node.dart';

import '../../utils/extensions.dart';
import '../fuick_state_widgets.dart';
import '../widget_factory.dart';
import '../widget_utils.dart';
import 'widget_parser.dart';

class ListViewParser extends WidgetParser {
  @override
  String get type => 'ListView';

  @override
  void dispose(int nodeId) {}

  @override
  void onCommand(String refId, String method, dynamic args) {}

  @override
  Widget parse(
    BuildContext context,
    Map<String, dynamic> props,
    dynamic children,
    WidgetFactory factory,
  ) {
    final String? refId = props['refId']?.toString();
    final dynamic cacheKey = props['cacheKey'];

    final bool hasBuilder = props['hasBuilder'] ?? false;
    final int? itemCount = asIntOrNull(props['itemCount']);

    return WidgetUtils.wrapPadding(
      props,
      FuickListView(
        refId: refId,
        cacheKey: cacheKey,
        itemCount: itemCount,
        shrinkWrap: props['shrinkWrap'] ?? true,
        physics: WidgetUtils.scrollPhysics(props['physics'] as String?),
        padding: WidgetUtils.edgeInsets(props['padding']),
        scrollDirection: WidgetUtils.axis(
          props['scrollDirection'] as String? ??
              props['orientation'] as String?,
        ),
        itemBuilder: hasBuilder
            ? (context, index) {
                if (refId == null) return Container();

                final appScope = FuickAppScope.of(context);
                final pageScope = FuickPageScope.of(context);
                if (appScope == null || pageScope == null) return Container();

                // Check local cache first
                final state = FuickListView.of(context);
                dynamic dslOrFuture;
                if (state != null) {
                  dslOrFuture = state.getCachedDsl(index);
                }

                dslOrFuture ??= appScope.getItemDSL(
                  pageScope.pageId,
                  refId,
                  index,
                );

                return FuickItemDSLBuilder(
                  dslOrFuture: dslOrFuture,
                  builder: (context, dsl) {
                    // Store in local cache when resolved
                    if (state != null) {
                      state.setCachedDsl(index, dsl);
                    }
                    return _buildItem(context, factory, dsl);
                  },
                );
              }
            : null,
        children: hasBuilder ? null : factory.buildChildren(context, children),
      ),
    );
  }

  Widget _buildItem(BuildContext context, WidgetFactory factory, dynamic dsl) {
    final manager = FuickNodeManagerProvider.of(context);
    if (manager != null && dsl is Map && dsl.containsKey('id')) {
      // Create/Update node in manager to ensure it receives incremental updates
      final node = manager.createNode(Map<String, dynamic>.from(dsl), manager);
      // Force wrap in _FuickNodeWidget to listen for updates
      return factory.buildFromNode(context, node, forceWrap: true);
    }
    return factory.build(context, dsl);
  }
}

class FuickListView extends StatefulWidget {
  final String? refId;
  final int? itemCount;
  final bool shrinkWrap;
  final ScrollPhysics? physics;
  final EdgeInsetsGeometry? padding;
  final Axis scrollDirection;
  final dynamic cacheKey;
  final List<Widget>? children;
  final Widget Function(BuildContext context, int index)? itemBuilder;
  final ControllerCallback<ScrollController>? onControllerCreated;
  final ControllerCallback<ScrollController>? onDispose;

  const FuickListView({
    super.key,
    this.refId,
    this.itemCount,
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
  State<FuickListView> createState() => FuickListViewState();

  static FuickListViewState? of(BuildContext context) {
    return context.findAncestorStateOfType<FuickListViewState>();
  }
}

class FuickListViewState extends State<FuickListView>
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
      final double offset = args['offset'].asDouble;
      final int duration = args['duration'].asIntOrNull ?? 300;
      final String curveStr = args['curve']?.toString() ?? 'easeInOut';
      final curve = WidgetUtils.curve(curveStr);
      _controller.animateTo(
        offset,
        duration: Duration(milliseconds: duration),
        curve: curve,
      );
    } else if (method == 'jumpTo') {
      if (!_controller.hasClients) return;
      final double offset = args['offset'].asDouble;
      _controller.jumpTo(offset);
    } else if (method == 'updateItem') {
      final int? index = asInt(args['index']);
      final dynamic dsl = args['dsl'];
      if (index != null && dsl != null) {
        setCachedDsl(index, dsl);
        forceUpdate();
      }
    } else if (method == 'refresh' || method == 'reloadData') {
      setState(() {
        _dslCache.clear();
      });
    } else if (method == 'scrollToIndex') {
      // Implement scroll logic if needed
      // Note: Scrollable.ensureVisible or similar might be needed
    }
  }

  @override
  void didUpdateWidget(FuickListView oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.cacheKey != oldWidget.cacheKey ||
        widget.itemCount != oldWidget.itemCount) {
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
      return ListView.builder(
        controller: _controller,
        itemCount: widget.itemCount,
        shrinkWrap: widget.shrinkWrap,
        physics: widget.physics,
        padding: widget.padding,
        scrollDirection: widget.scrollDirection,
        itemBuilder: widget.itemBuilder!,
      );
    }

    return ListView(
      controller: _controller,
      shrinkWrap: widget.shrinkWrap,
      physics: widget.physics,
      padding: widget.padding,
      scrollDirection: widget.scrollDirection,
      children: widget.children ?? [],
    );
  }
}
