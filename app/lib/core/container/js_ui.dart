import 'package:flutter/material.dart';
import 'package:flutter_quickjs/core/widgets/widget_factory.dart';

import 'fuick_app_controller.dart';
import 'js_event_dispatch.dart';

class JSRender {
  static Widget buildFromDsl(
    Map<String, dynamic> dsl,
    FuickAppController controller,
  ) {
    return WidgetFactory(
      onAction: (call, args) {
        if (call == '__event' && args is Map) {
          final m = Map<String, dynamic>.from(args);
          final id = (m['id'] ?? '') as String;
          final payload = m['payload'];
          if (id.isNotEmpty) {
            JsEventDispatch.dispatchEvent(controller, id, payload);
          }
        }
      },
    ).build(dsl);
  }
}
