import 'package:flutter/material.dart';
import '../widget_factory.dart';
import '../widget_utils.dart';
import 'widget_parser.dart';

class ContainerParser extends WidgetParser {
  @override
  String get type => 'Container';

  @override
  Widget parse(BuildContext context, Map<String, dynamic> props, dynamic children, WidgetFactory factory) {
    final decoration = WidgetUtils.boxDecorationFromProps(props);
    return Container(
      width: WidgetUtils.sizeNum(props['width']),
      height: WidgetUtils.sizeNum(props['height']),
      alignment: WidgetUtils.alignment(props['alignment'] as String?),
      padding: WidgetUtils.edgeInsets(props['padding']),
      margin: WidgetUtils.edgeInsets(props['margin']),
      decoration: decoration,
      child: factory.buildFirstChild(context, children),
    );
  }
}
