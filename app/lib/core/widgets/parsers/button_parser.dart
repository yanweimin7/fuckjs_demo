import 'package:flutter/material.dart';
import '../../container/fuick_action.dart';
import '../widget_factory.dart';
import '../widget_utils.dart';
import 'widget_parser.dart';

class ButtonParser extends WidgetParser {
  @override
  String get type => 'Button';

  @override
  Widget parse(BuildContext context, Map<String, dynamic> props,
      dynamic children, WidgetFactory factory) {
    final text = (props['text'] ?? '').toString();
    final event = props['onTap'];
    return WidgetUtils.wrapPadding(
      props,
      ElevatedButton(
        onPressed: () {
          FuickAction.event(context, event);
        },
        child: Text(text),
      ),
    );
  }
}
