import 'package:flutter/material.dart';
import '../widget_factory.dart';
import '../widget_utils.dart';
import 'widget_parser.dart';

class AppBarParser extends WidgetParser {
  @override
  String get type => 'AppBar';

  @override
  Widget parse(BuildContext context, Map<String, dynamic> props,
      dynamic children, WidgetFactory factory) {
    final titleDsl = props['title'];
    final leadingDsl = props['leading'];
    final actionsDsl = props['actions'];

    List<Widget>? actions;
    if (actionsDsl is List) {
      actions = actionsDsl
          .map((e) => e != null ? factory.build(context, e) : null)
          .whereType<Widget>()
          .toList();
    } else if (actionsDsl != null) {
      final action = factory.build(context, actionsDsl);
      actions = [action];
    }

    return AppBar(
      title: titleDsl != null ? factory.build(context, titleDsl) : null,
      leading: leadingDsl != null ? factory.build(context, leadingDsl) : null,
      actions: actions,
      backgroundColor:
          WidgetUtils.colorFromHex(props['backgroundColor'] as String?),
      foregroundColor:
          WidgetUtils.colorFromHex(props['foregroundColor'] as String?),
      centerTitle: props['centerTitle'] as bool?,
      elevation: WidgetUtils.sizeNum(props['elevation']),
    );
  }
}
