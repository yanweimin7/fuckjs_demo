import 'package:flutter/material.dart';
import '../fuick_state_widgets.dart';
import '../widget_factory.dart';
import '../widget_utils.dart';
import 'widget_parser.dart';

class ListViewParser extends WidgetParser {
  @override
  String get type => 'ListView';

  final Map<String, ScrollController> _controllers = {};

  @override
  void dispose(int id) {}

  @override
  void onCommand(String refId, String method, dynamic args) {
    final controller = _controllers[refId];
    if (controller == null) {
      debugPrint('ListViewParser: controller not found for refId $refId');
      return;
    }

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

    return WidgetUtils.wrapPadding(
      props,
      FuickScrollable(
        refId: refId,
        onControllerCreated: (controller) {
          if (refId != null) {
            _controllers[refId] = controller;
          }
        },
        onDispose: () {
          if (refId != null) {
            _controllers.remove(refId);
          }
        },
        builder: (context, controller) {
          return ListView(
            controller: controller,
            shrinkWrap: props['shrinkWrap'] ?? true,
            padding: WidgetUtils.edgeInsets(props['padding']),
            scrollDirection:
                WidgetUtils.axis(props['scrollDirection'] as String?),
            children: factory.buildChildren(context, children),
          );
        },
      ),
    );
  }
}
