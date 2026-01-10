import 'dart:convert';

import 'fuick_app_controller.dart';

class JsEventDispatch {
  static void dispatchEvent(
    FuickAppController controller,
    String eventId,
    dynamic payload,
  ) {
    if (payload == null) {
      controller.ctx.global.invoke('__dispatchEvent', [eventId]);
    } else {
      controller.ctx.global.invoke('__dispatchEvent', [eventId, payload]);
    }
  }
}
