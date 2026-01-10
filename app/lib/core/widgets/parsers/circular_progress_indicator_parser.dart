import 'package:flutter/material.dart';
import '../widget_factory.dart';
import '../widget_utils.dart';
import 'widget_parser.dart';

class CircularProgressIndicatorParser extends WidgetParser {
  @override
  String get type => 'CircularProgressIndicator';

  @override
  Widget parse(BuildContext context, Map<String, dynamic> props, dynamic children, WidgetFactory factory) {
    final color = WidgetUtils.colorFromHex(props['color'] as String?);
    return WidgetUtils.wrapPadding(
      props,
      CircularProgressIndicator(
        value: WidgetUtils.sizeNum(props['value']),
        backgroundColor: WidgetUtils.colorFromHex(props['backgroundColor'] as String?),
        valueColor: color != null ? AlwaysStoppedAnimation<Color>(color) : null,
        strokeWidth: WidgetUtils.sizeNum(props['strokeWidth']) ?? 4.0,
      ),
    );
  }
}
