import 'package:flutter/material.dart';
import '../widget_factory.dart';
import '../widget_utils.dart';
import 'widget_parser.dart';

class ListViewParser extends WidgetParser {
  @override
  String get type => 'ListView';

  @override
  Widget parse(BuildContext context, Map<String, dynamic> props, dynamic children, WidgetFactory factory) {
    return WidgetUtils.wrapPadding(
      props,
      ListView(
        shrinkWrap: true,
        padding: WidgetUtils.edgeInsets(props['padding']),
        scrollDirection: WidgetUtils.axis(props['scrollDirection'] as String?),
        children: factory.buildChildren(context, children),
      ),
    );
  }
}
