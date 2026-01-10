import 'package:flutter/material.dart';
import '../widget_factory.dart';
import '../widget_utils.dart';
import 'widget_parser.dart';

class OpacityParser extends WidgetParser {
  @override
  String get type => 'Opacity';

  @override
  Widget parse(BuildContext context, Map<String, dynamic> props, dynamic children, WidgetFactory factory) {
    final opacity = (props['opacity'] is num) ? (props['opacity'] as num).toDouble() : 1.0;
    return Opacity(
      opacity: opacity,
      child: factory.buildFirstChild(context, children),
    );
  }
}
