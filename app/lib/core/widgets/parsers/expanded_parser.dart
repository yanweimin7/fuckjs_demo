import 'package:flutter/material.dart';
import '../widget_factory.dart';
import 'widget_parser.dart';

class ExpandedParser extends WidgetParser {
  @override
  String get type => 'Expanded';

  @override
  Widget parse(BuildContext context, Map<String, dynamic> props, dynamic children, WidgetFactory factory) {
    final flex = (props['flex'] is num) ? (props['flex'] as num).toInt() : 1;
    return Expanded(
      flex: flex,
      child: factory.buildFirstChild(context, children),
    );
  }
}
