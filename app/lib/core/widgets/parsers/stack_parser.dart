import 'package:flutter/material.dart';
import '../widget_factory.dart';
import '../widget_utils.dart';
import 'widget_parser.dart';

class StackParser extends WidgetParser {
  @override
  String get type => 'Stack';

  @override
  Widget parse(BuildContext context, Map<String, dynamic> props, dynamic children, WidgetFactory factory) {
    return WidgetUtils.wrapPadding(
      props,
      Stack(
        alignment: WidgetUtils.stackAlignment(props['alignment'] as String?),
        children: factory.buildChildren(context, children),
      ),
    );
  }
}
