import 'package:flutter/material.dart';
import 'package:flutter_quickjs/core/service/fuick_command_bus.dart';
import '../../container/fuick_app_controller.dart';
import '../fuick_state_widgets.dart';
import '../widget_factory.dart';
import '../widget_utils.dart';
import 'widget_parser.dart';

class BatchedListViewParser extends WidgetParser {
  @override
  String get type => 'BatchedListView';

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
    final List<dynamic> items = props['items'] as List<dynamic>? ?? [];
    final axis = WidgetUtils.axis(
        props['scrollDirection'] as String? ?? props['orientation'] as String?);
    final shrinkWrap = props['shrinkWrap'] ?? true;

    Widget listView = FuickBatchedListView(
      refId: refId,
      items: items,
      shrinkWrap: shrinkWrap,
      physics: WidgetUtils.scrollPhysics(props['physics'] as String?),
      padding: WidgetUtils.edgeInsets(props['padding']),
      scrollDirection: axis,
      factory: factory,
    );

    // If it's a horizontal ListView with shrinkWrap inside a Column (unbounded height),
    // it will throw "Horizontal viewport was given unbounded height".
    // We don't wrap it here because we want the JS side to control the height via Container.

    return WidgetUtils.wrapPadding(
      props,
      listView,
    );
  }
}

class FuickBatchedListView extends StatefulWidget {
  final String? refId;
  final List<dynamic> items;
  final bool shrinkWrap;
  final ScrollPhysics? physics;
  final EdgeInsetsGeometry? padding;
  final Axis scrollDirection;
  final WidgetFactory factory;
  final ControllerCallback<ScrollController>? onControllerCreated;
  final ControllerCallback<ScrollController>? onDispose;

  const FuickBatchedListView({
    super.key,
    this.refId,
    required this.items,
    this.shrinkWrap = false,
    this.physics,
    this.padding,
    this.scrollDirection = Axis.vertical,
    required this.factory,
    this.onControllerCreated,
    this.onDispose,
  });

  @override
  State<FuickBatchedListView> createState() => _FuickBatchedListViewState();
}

class _FuickBatchedListViewState extends State<FuickBatchedListView>
    with AutomaticKeepAliveClientMixin {
  late ScrollController _controller;
  FuickCommandBus? _commandBus;

  @override
  bool get wantKeepAlive => true;

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

    // Fix: When shrinkWrap is true and scrollDirection is horizontal,
    // we need to ensure the parent provides bounded height.
    // If shrinkWrap is true, ListView will try to take as much space as it needs in the cross axis.
    return ListView.builder(
      controller: _controller,
      itemCount: widget.items.length,
      shrinkWrap: widget.shrinkWrap,
      physics: widget.physics,
      padding: widget.padding,
      scrollDirection: widget.scrollDirection,
      itemBuilder: (context, index) {
        return widget.factory.build(context, widget.items[index]);
      },
    );
  }
}
