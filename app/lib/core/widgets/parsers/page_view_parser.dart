import 'package:flutter/material.dart';

import '../../container/fuick_action.dart';
import '../../utils/extensions.dart';
import '../fuick_state_widgets.dart';
import '../widget_factory.dart';
import '../widget_utils.dart';
import 'widget_parser.dart';

class PageViewParser extends WidgetParser {
  @override
  String get type => 'PageView';

  @override
  void onCommand(String refId, String method, dynamic args) {}

  @override
  Widget parse(
    BuildContext context,
    Map<String, dynamic> props,
    dynamic children,
    WidgetFactory factory,
  ) {
    final int? initialPage = asIntOrNull(props['initialPage']);
    final String? refId = props['refId']?.toString();

    return WidgetUtils.wrapPadding(
      props,
      FuickPageView(
        key: refId != null ? ValueKey(refId) : null,
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
        children: factory.buildChildren(context, children),
      ),
    );
  }

  @override
  void dispose(int nodeId) {}
}
