import 'package:flutter/material.dart';
import '../widget_factory.dart';
import '../widget_utils.dart';
import 'widget_parser.dart';

class IconParser extends WidgetParser {
  @override
  String get type => 'Icon';

  @override
  Widget parse(BuildContext context, Map<String, dynamic> props, dynamic children, WidgetFactory factory) {
    final cp = props['codePoint'] is num ? (props['codePoint'] as num).toInt() : null;
    final color = WidgetUtils.colorFromHex(props['color'] as String?);
    final size = WidgetUtils.sizeNum(props['size']);
    final data = cp == null ? Icons.circle : IconData(cp, fontFamily: 'MaterialIcons');
    return WidgetUtils.wrapPadding(props, Icon(data, color: color, size: size));
  }
}
