import 'package:flutter/material.dart';
import '../../container/fuick_action.dart';
import '../widget_factory.dart';
import '../widget_utils.dart';
import 'widget_parser.dart';

class GestureDetectorParser extends WidgetParser {
  @override
  String get type => 'GestureDetector';

  @override
  Widget parse(BuildContext context, Map<String, dynamic> props,
      dynamic children, WidgetFactory factory) {
    return WidgetUtils.wrapPadding(
      props,
      GestureDetector(
        onTap: props['onTap'] != null
            ? () {
                FuickAction.event(context, props['onTap']);
              }
            : null,
        onDoubleTap: props['onDoubleTap'] != null
            ? () => FuickAction.event(context, props['onDoubleTap'])
            : null,
        onLongPress: props['onLongPress'] != null
            ? () => FuickAction.event(context, props['onLongPress'])
            : null,
        onPanStart: props['onPanStart'] != null
            ? (details) => FuickAction.event(context, props['onPanStart'],
                    value: {
                      'dx': details.localPosition.dx,
                      'dy': details.localPosition.dy
                    })
            : null,
        onPanUpdate: props['onPanUpdate'] != null
            ? (details) => FuickAction.event(context, props['onPanUpdate'],
                    value: {
                      'dx': details.localPosition.dx,
                      'dy': details.localPosition.dy
                    })
            : null,
        onPanEnd: props['onPanEnd'] != null
            ? (details) => FuickAction.event(context, props['onPanEnd'])
            : null,
        child: factory.buildFirstChild(context, children),
      ),
    );
  }
}
