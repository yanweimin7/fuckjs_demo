import 'package:flutter/material.dart';
import '../widget_factory.dart';
import '../widget_utils.dart';
import 'widget_parser.dart';

class SingleChildScrollViewParser extends WidgetParser {
  @override
  String get type => 'SingleChildScrollView';

  @override
  Widget parse(BuildContext context, Map<String, dynamic> props, dynamic children, WidgetFactory factory) {
    return SingleChildScrollView(
      padding: WidgetUtils.edgeInsets(props['padding']),
      scrollDirection: WidgetUtils.axis(props['scrollDirection'] as String?),
      child: factory.buildFirstChild(context, children),
    );
  }
}
