import 'dart:convert';

import 'fuick_app_controller.dart';

class JsEventDispatch {
  static void dispatchEvent(
    FuickAppController controller,
    String eventId,
    dynamic payload,
  ) {
    final p = payload == null
        ? '{}'
        : payload is String
        ? payload
        : jsonEncode(payload);
    controller.ctx.callFunction('__dispatchEvent', [eventId, p]);
  }
}
