import 'dart:async';

import 'package:flutter/cupertino.dart';
import 'package:flutter_quickjs/quickjs_ffi.dart';

import '../container/fuick_app_controller.dart';
import 'js_handler_registry.dart';

class JsHandlerManager {
  static final Map<int, Timer> _timers = {};

  static registerHandlers(QuickJsContext ctx, FuickAppController controller) {
    final reg = JsHandlerRegistry(ctx);

    reg.onSync('console', (args) {
      final m = args is Map ? args : {};
      final level = m['level'] ?? 'log';
      final message = m['message'] ?? '';
      debugPrint('[JS $level] $message');
      return null;
    });

    reg.onSync('createTimer', (args) {
      final m = args is Map ? args : {};
      final id = (m['id'] as num?)?.toInt() ?? 0;
      final delay = (m['delay'] as num?)?.toInt() ?? 0;
      final isInterval = (m['isInterval'] ?? false) as bool;

      if (isInterval) {
        _timers[id] = Timer.periodic(Duration(milliseconds: delay), (timer) {
          try {
            ctx.callFunction('__handleTimer', [id]);
          } catch (e) {
            debugPrint('Error calling __handleTimer (periodic): $e');
            timer.cancel();
            _timers.remove(id);
          }
        });
      } else {
        _timers[id] = Timer(Duration(milliseconds: delay), () {
          _timers.remove(id);
          try {
            ctx.callFunction('__handleTimer', [id]);
          } catch (e) {
            debugPrint('Error calling __handleTimer: $e');
          }
        });
      }
      return null;
    });

    reg.onSync('deleteTimer', (args) {
      final m = args is Map ? args : {};
      final id = (m['id'] as num?)?.toInt() ?? 0;
      _timers.remove(id)?.cancel();
      return null;
    });

    reg.onSync('push', (args) {
      final m = args is Map
          ? Map<String, dynamic>.from(args)
          : <String, dynamic>{};
      final path = (m['path'] ?? '') as String;
      final params = m['params'] ?? {};
      if (path.isNotEmpty) {
        controller.pushWithPath(path, Map<String, dynamic>.from(params));
      }
      return true;
    });

    reg.onSync('pop', (args) {
      controller.pop();
      return true;
    });

    _registerToCtx(ctx, reg, controller);
  }

  static _registerToCtx(
    QuickJsContext ctx,
    JsHandlerRegistry reg,
    FuickAppController controller,
  ) {
    ctx.registerCallNative((method, args) {
      try {
        if (method == 'renderUI') {
          if (args.length >= 2) {
            final pageId = (args[0] as num).toInt();
            final renderData =
                (args[1] as Map?)?.cast<String, dynamic>() ??
                const <String, dynamic>{};
            controller.render(pageId, renderData);
            return true;
          } else if (args.length == 1 && args[0] is Map) {
            final m = args[0] as Map;
            final pageId = (m['pageId'] as num?)?.toInt();
            final renderData =
                (m['renderData'] as Map?)?.cast<String, dynamic>() ??
                const <String, dynamic>{};
            if (pageId != null) {
              controller.render(pageId, renderData);
              return true;
            }
          }
        }
        final h = reg.sync[method];
        if (h != null) {
          final arg = args.isNotEmpty ? args[0] : null;
          return h(arg);
        }
      } catch (e, s) {
        print("failed to callNative $e , $s");
      }
      return null;
    });
    // ctx.registerCallAsyncTyped((method, args) {
    //   final h = reg.async[method];
    //   if (h != null) return h(args);
    //   return null;
    // });
    // ctx.registerCallAsyncDefer((method, args, id) {
    //   final h = reg.defer[method];
    //   if (h != null) {
    //     h(args, id);
    //     return;
    //   } else {
    //     ctx.asyncResolveTyped(id, {
    //       'ok': false,
    //       'error': 'method $method not found',
    //     }, isError: true);
    //   }
    // });
  }
}
