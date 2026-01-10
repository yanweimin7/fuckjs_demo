import 'package:flutter/material.dart';
import '../widget_factory.dart';
import '../widget_utils.dart';
import 'widget_parser.dart';

class DividerParser extends WidgetParser {
  @override
  String get type => 'Divider';

  @override
  Widget parse(BuildContext context, Map<String, dynamic> props, dynamic children, WidgetFactory factory) {
    return Divider(
      height: WidgetUtils.sizeNum(props['height']),
      thickness: WidgetUtils.sizeNum(props['thickness']),
      color: WidgetUtils.colorFromHex(props['color'] as String?),
      indent: WidgetUtils.sizeNum(props['indent']),
      endIndent: WidgetUtils.sizeNum(props['endIndent']),
    );
  }
}
