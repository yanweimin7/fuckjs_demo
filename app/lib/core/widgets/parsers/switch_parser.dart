import 'package:flutter/material.dart';
import '../../container/fuick_action.dart';
import '../widget_factory.dart';
import '../widget_utils.dart';
import 'widget_parser.dart';

class SwitchParser extends WidgetParser {
  @override
  String get type => 'Switch';

  @override
  Widget parse(BuildContext context, Map<String, dynamic> props, dynamic children, WidgetFactory factory) {
    final v = props['value'] == true;
    final onChangedEvent = props['onChanged'];
    return WidgetUtils.wrapPadding(
      props,
      Switch(
        value: v,
        onChanged: (nv) {
          FuickAction.event(context, onChangedEvent, value: nv);
        },
      ),
    );
  }
}
