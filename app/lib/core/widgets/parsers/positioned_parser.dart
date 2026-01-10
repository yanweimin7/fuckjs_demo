import 'package:flutter/material.dart';
import '../widget_factory.dart';
import '../widget_utils.dart';
import 'widget_parser.dart';

class PositionedParser extends WidgetParser {
  @override
  String get type => 'Positioned';

  @override
  Widget parse(BuildContext context, Map<String, dynamic> props, dynamic children, WidgetFactory factory) {
    return Positioned(
      left: WidgetUtils.sizeNum(props['left']),
      top: WidgetUtils.sizeNum(props['top']),
      right: WidgetUtils.sizeNum(props['right']),
      bottom: WidgetUtils.sizeNum(props['bottom']),
      width: WidgetUtils.sizeNum(props['width']),
      height: WidgetUtils.sizeNum(props['height']),
      child: factory.buildFirstChild(context, children),
    );
  }
}
