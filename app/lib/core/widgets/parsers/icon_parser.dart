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
    final name = props['name']?.toString();
    final color = WidgetUtils.colorFromHex(props['color'] as String?);
    final size = WidgetUtils.sizeNum(props['size']);

    IconData data;
    if (cp != null) {
      data = IconData(cp, fontFamily: 'MaterialIcons');
    } else if (name != null) {
      data = WidgetUtils.iconData(name);
    } else {
      data = Icons.circle;
    }

    return WidgetUtils.wrapPadding(props, Icon(data, color: color, size: size));
  }
}
