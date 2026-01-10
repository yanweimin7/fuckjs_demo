import 'package:flutter/material.dart';
import '../../container/fuick_action.dart';
import '../widget_factory.dart';
import 'widget_parser.dart';

class GestureDetectorParser extends WidgetParser {
  @override
  String get type => 'GestureDetector';

  @override
  Widget parse(BuildContext context, Map<String, dynamic> props, dynamic children, WidgetFactory factory) {
    final event = props['onTap'];
    return GestureDetector(
      onTap: () {
        FuickAction.event(context, event);
      },
      child: factory.buildFirstChild(context, children),
    );
  }
}
