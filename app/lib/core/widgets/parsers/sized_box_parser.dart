import 'package:flutter/material.dart';
import '../widget_factory.dart';
import '../widget_utils.dart';
import 'widget_parser.dart';

class SizedBoxParser extends WidgetParser {
  @override
  String get type => 'SizedBox';

  @override
  Widget parse(BuildContext context, Map<String, dynamic> props, dynamic children, WidgetFactory factory) {
    return SizedBox(
      width: WidgetUtils.sizeNum(props['width']),
      height: WidgetUtils.sizeNum(props['height']),
      child: factory.buildFirstChild(context, children),
    );
  }
}
