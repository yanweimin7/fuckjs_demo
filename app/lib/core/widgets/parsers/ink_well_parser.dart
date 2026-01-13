import 'package:flutter/material.dart';
import '../../container/fuick_action.dart';
import '../widget_factory.dart';
import 'widget_parser.dart';

class InkWellParser extends WidgetParser {
  @override
  String get type => 'InkWell';

  @override
  Widget parse(BuildContext context, Map<String, dynamic> props,
      dynamic children, WidgetFactory factory) {
    final onTapObj = props['onTap'];
    return InkWell(
      onTap: onTapObj != null
          ? () {
              debugPrint('[InkWell] onTap triggered! eventObj: $onTapObj');
              FuickAction.event(context, onTapObj);
            }
          : null,
      onDoubleTap: props['onDoubleTap'] != null
          ? () => FuickAction.event(context, props['onDoubleTap'])
          : null,
      onLongPress: props['onLongPress'] != null
          ? () => FuickAction.event(context, props['onLongPress'])
          : null,
      child: factory.buildFirstChild(context, children),
    );
  }
}
