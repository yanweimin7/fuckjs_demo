import 'package:flutter/material.dart';

import '../../container/fuick_action.dart';
import '../widget_factory.dart';
import '../widget_utils.dart';
import 'widget_parser.dart';

class TextFieldParser extends WidgetParser {
  @override
  String get type => 'TextField';

  static final Map<int, TextEditingController> _controllers = {};

  @override
  void dispose(int nodeId) {
    final controller = _controllers.remove(nodeId);
    controller?.dispose();
  }

  @override
  Widget parse(
    BuildContext context,
    Map<String, dynamic> props,
    dynamic children,
    WidgetFactory factory,
  ) {
    // We need the node ID to persist the controller.
    // The DSL structure usually has 'id' at the root of the node object.
    // However, in the current 'parse' interface, we don't pass the full DSL, only props.
    // Let's assume for now that if we need state persistence, the node ID should be in props.
    final nodeId = (props['__nodeId'] as num?)?.toInt();

    TextEditingController? controller;
    if (nodeId != null) {
      controller = _controllers.putIfAbsent(nodeId, () {
        return TextEditingController(text: props['text'] as String? ?? '');
      });
      // Update text if it changed from JS but not by user input
      if (props['text'] != null && controller.text != props['text']) {
        controller.text = props['text'] as String;
      }
    }

    final hint = (props['hintText'] ?? props['hint'] ?? '') as String;
    final onChangedEvent = props['onChanged'];
    final onSubmittedEvent = props['onSubmitted'];
    return WidgetUtils.wrapPadding(
      props,
      TextField(
        controller: controller,
        decoration: InputDecoration(
          hintText: hint,
          border: props['border'] == 'none' ? InputBorder.none : null,
        ),
        onChanged: (v) {
          FuickAction.event(context, onChangedEvent, value: v);
        },
        onSubmitted: (v) {
          FuickAction.event(context, onSubmittedEvent, value: v);
        },
      ),
    );
  }
}
