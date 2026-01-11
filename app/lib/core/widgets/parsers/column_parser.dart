import 'package:flutter/material.dart';
import '../widget_factory.dart';
import '../widget_utils.dart';
import 'widget_parser.dart';

class ColumnParser extends WidgetParser {
  @override
  String get type => 'Column';

  @override
  Widget parse(BuildContext context, Map<String, dynamic> props,
      dynamic children, WidgetFactory factory) {
    return WidgetUtils.wrapPadding(
      props,
      Column(
        mainAxisAlignment:
            WidgetUtils.mainAxis(props['mainAxisAlignment'] as String?),
        crossAxisAlignment:
            WidgetUtils.crossAxis(props['crossAxisAlignment'] as String?),
        mainAxisSize:
            WidgetUtils.mainAxisSize(props['mainAxisSize'] as String?),
        children: factory.buildChildren(context, children),
      ),
    );
  }
}
