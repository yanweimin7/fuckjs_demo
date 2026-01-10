import 'package:flutter/material.dart';
import '../widget_factory.dart';
import 'widget_parser.dart';

class CenterParser extends WidgetParser {
  @override
  String get type => 'Center';

  @override
  Widget parse(BuildContext context, Map<String, dynamic> props, dynamic children, WidgetFactory factory) {
    return Center(
      child: factory.buildFirstChild(context, children),
    );
  }
}
