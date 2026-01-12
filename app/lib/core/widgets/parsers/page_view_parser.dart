import 'package:flutter/material.dart';

import '../../container/fuick_action.dart';
import '../fuick_state_widgets.dart';
import '../widget_factory.dart';
import '../widget_utils.dart';
import 'widget_parser.dart';

class PageViewParser extends WidgetParser {
  @override
  String get type => 'PageView';

  final Map<String, PageController> _controllers = {};

  @override
  void onCommand(String refId, String method, dynamic args) {
    final controller = _controllers[refId];
    if (controller == null) {
      debugPrint('PageViewParser: controller not found for refId $refId');
      return;
    }

    if (!controller.hasClients) {
      debugPrint('PageViewParser: controller has no clients for refId $refId');
      return;
    }

    if (method == 'animateToPage') {
      final page = (args['page'] as num).toInt();
      final duration = (args['duration'] as num?)?.toInt() ?? 300;
      final curveName = args['curve'] as String? ?? 'easeInOut';

      final curve = WidgetUtils.curve(curveName);

      controller.animateToPage(
        page,
        duration: Duration(milliseconds: duration),
        curve: curve,
      );
    } else if (method == 'setPageIndex') {
      final index = (args['index'] as num).toInt();
      controller.jumpToPage(index);
    }
  }

  @override
  Widget parse(
    BuildContext context,
    Map<String, dynamic> props,
    dynamic children,
    WidgetFactory factory,
  ) {
    final int? initialPage = (props['initialPage'] as num?)?.toInt();
    final String? refId = props['refId']?.toString();

    return WidgetUtils.wrapPadding(
      props,
      FuickPageView(
        refId: refId,
        initialPage: initialPage ?? 0,
        scrollDirection: props['scrollDirection'] == 'vertical'
            ? Axis.vertical
            : Axis.horizontal,
        onPageChanged: (index) {
          if (props['onPageChanged'] != null) {
            FuickAction.event(context, props['onPageChanged'], value: index);
          }
        },
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
        children: factory.buildChildren(context, children),
      ),
    );
  }

  @override
  void dispose(int nodeId) {}
}
