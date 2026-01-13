import 'package:flutter/material.dart';

import 'fuick_app_controller.dart';

class FuickAction {
  static void event(BuildContext context, dynamic eventObj, {dynamic value}) {
    final controller = FuickAppScope.of(context);
    if (controller == null) {
      debugPrint('[FuickAction] Error: FuickAppScope not found in context');
      return;
    }
    debugPrint('[FuickAction] Dispatching event to JS: $eventObj');
    controller.ctx.invoke('FuickUIController', 'dispatchEvent', [
      eventObj,
      value,
    ]);
  }
}
