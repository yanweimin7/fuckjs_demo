import 'package:flutter/material.dart';
import '../../utils/extensions.dart';
import '../widget_factory.dart';
import '../widget_utils.dart';
import 'widget_parser.dart';

class TextParser extends WidgetParser {
  @override
  String get type => 'Text';

  @override
  Widget parse(BuildContext context, Map<String, dynamic> props,
      dynamic children, WidgetFactory factory) {
    final text = (props['text'] ?? '').toString();
    final fontSize = asDoubleOrNull(props['fontSize']);
    final color = WidgetUtils.colorFromHex(props['color'] as String?);
    final fontWeight = props['fontWeight'] == 'bold' ? FontWeight.bold : null;

    return WidgetUtils.wrapPadding(
      props,
      Text(
        text,
        style: TextStyle(
          fontSize: fontSize,
          color: color,
          fontWeight: fontWeight,
        ),
      ),
    );
  }
}
