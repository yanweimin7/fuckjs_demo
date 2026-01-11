import 'package:flutter/material.dart';

import 'fuick_app_controller.dart';

class FuickAction {
  static void event(BuildContext context, dynamic eventObj, {dynamic value}) {
    final controller = FuickAppScope.of(context);
    if (controller == null) {
      debugPrint('[FuickAction] Error: FuickAppScope not found in context');
      return;
    }
    controller.ctx.global.invoke('__dispatchEvent', [eventObj, value]);
    controller.ctx.runJobs(); // Ensure microtasks run after event dispatch
  }
}
