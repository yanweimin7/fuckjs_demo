import 'package:flutter/material.dart';
import '../widget_factory.dart';
import '../widget_utils.dart';
import 'widget_parser.dart';

class ScaffoldParser extends WidgetParser {
  @override
  String get type => 'Scaffold';

  @override
  Widget parse(BuildContext context, Map<String, dynamic> props,
      dynamic children, WidgetFactory factory) {
    final appBarDsl = props['appBar'];
    final bodyDsl = props['body'];
    final fabDsl = props['floatingActionButton'];

    Widget? body = bodyDsl != null ? factory.build(context, bodyDsl) : null;
    if (body == null && children != null) {
      body = factory.buildFirstChild(context, children);
    }

    Widget? appBarWidget =
        appBarDsl != null ? factory.build(context, appBarDsl) : null;
    PreferredSizeWidget? appBar;
    if (appBarWidget is PreferredSizeWidget) {
      appBar = appBarWidget;
    } else if (appBarWidget != null) {
      appBar = PreferredSize(
        preferredSize: const Size.fromHeight(kToolbarHeight),
        child: appBarWidget,
      );
    }

    return Scaffold(
      backgroundColor:
          WidgetUtils.colorFromHex(props['backgroundColor'] as String?),
      appBar: appBar,
      body: body,
      floatingActionButton:
          fabDsl != null ? factory.build(context, fabDsl) : null,
    );
  }
}
