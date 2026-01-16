import 'package:flutter/material.dart';

import '../fuick_state_widgets.dart';
import '../widget_factory.dart';
import '../widget_utils.dart';
import 'widget_parser.dart';

class SingleChildScrollViewParser extends WidgetParser {
  @override
  String get type => 'SingleChildScrollView';

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

    return WidgetUtils.wrapPadding(
      props,
      FuickScrollable(
        key: refId != null ? ValueKey(refId) : null,
        refId: refId,
        builder: (context, controller) {
          return SingleChildScrollView(
            controller: controller,
            physics: WidgetUtils.scrollPhysics(props['physics'] as String?),
            padding: WidgetUtils.edgeInsets(props['padding']),
            scrollDirection: WidgetUtils.axis(
              props['scrollDirection'] as String?,
            ),
            child: factory.buildFirstChild(context, children),
          );
        },
      ),
    );
  }
}
