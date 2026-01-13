import 'package:flutter/material.dart';

import '../../container/fuick_action.dart';
import '../fuick_state_widgets.dart';
import '../widget_factory.dart';
import '../widget_utils.dart';
import 'widget_parser.dart';

class TextFieldParser extends WidgetParser {
  @override
  String get type => 'TextField';

  @override
  Widget parse(
    BuildContext context,
    Map<String, dynamic> props,
    dynamic children,
    WidgetFactory factory,
  ) {
    final hint = (props['hintText'] ?? props['hint'] ?? '') as String;
    final text = (props['text'] ?? '') as String;
    final refId = props['refId'] as String?;
    final border = props['border'] as String?;

    final onChangedEvent = props['onChanged'];
    final onSubmittedEvent = props['onSubmitted'];

    return WidgetUtils.wrapPadding(
      props,
      FuickTextField(
        refId: refId,
        text: text,
        hintText: hint,
        border: border,
        props: props,
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
