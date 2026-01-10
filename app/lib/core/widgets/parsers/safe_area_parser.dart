import 'package:flutter/material.dart';
import '../widget_factory.dart';
import 'widget_parser.dart';

class SafeAreaParser extends WidgetParser {
  @override
  String get type => 'SafeArea';

  @override
  Widget parse(BuildContext context, Map<String, dynamic> props, dynamic children, WidgetFactory factory) {
    return SafeArea(
      left: props['left'] as bool? ?? true,
      top: props['top'] as bool? ?? true,
      right: props['right'] as bool? ?? true,
      bottom: props['bottom'] as bool? ?? true,
      child: factory.buildFirstChild(context, children),
    );
  }
}
