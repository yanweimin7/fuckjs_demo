import 'package:flutter/material.dart';
import '../../utils/extensions.dart';
import '../widget_factory.dart';
import 'widget_parser.dart';

class FlexibleParser extends WidgetParser {
  @override
  String get type => 'Flexible';

  @override
  Widget parse(BuildContext context, Map<String, dynamic> props,
      dynamic children, WidgetFactory factory) {
    final flex = asIntOrNull(props['flex']) ?? 1;
    final fit = props['fit'] == 'tight' ? FlexFit.tight : FlexFit.loose;
    return Flexible(
      flex: flex,
      fit: fit,
      child: factory.buildFirstChild(context, children),
    );
  }
}
