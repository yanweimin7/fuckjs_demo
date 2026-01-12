import 'package:flutter/material.dart';
import '../widget_factory.dart';

abstract class WidgetParser {
  String get type;

  Widget parse(
    BuildContext context,
    Map<String, dynamic> props,
    dynamic children,
    WidgetFactory factory,
  );

  void dispose(int nodeId) {}

  void onCommand(String refId, String method, dynamic args) {}
}
