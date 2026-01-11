import 'dart:async';

import 'package:flutter/cupertino.dart';

import '../container/fuick_app_controller.dart';
import '../engine/jscontext.dart';
import 'js_handler_registry.dart';

class JsHandlerManager {
  static final Map<int, Map<int, Timer>> _contextTimers = {};

  static registerHandlers(QuickJsContext ctx, FuickAppController controller) {
    final reg = JsHandlerRegistry(ctx);
    final ctxAddr = ctx.handleAddress;

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

      final timers = _contextTimers.putIfAbsent(ctxAddr, () => {});

      if (isInterval) {
        timers[id] = Timer.periodic(Duration(milliseconds: delay), (timer) {
          try {
            ctx.global.invoke('__handleTimer', [id]);
          } catch (e) {
            debugPrint('Error calling __handleTimer (periodic): $e');
            timer.cancel();
            timers.remove(id);
          }
        });
      } else {
        timers[id] = Timer(Duration(milliseconds: delay), () {
          timers.remove(id);
          try {
            ctx.global.invoke('__handleTimer', [id]);
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
      _contextTimers[ctxAddr]?.remove(id)?.cancel();
      return null;
    });

    reg.onSync('push', (args) {
      final m =
          args is Map ? Map<String, dynamic>.from(args) : <String, dynamic>{};
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

    reg.onDefer('testFuture', (args, callback, reject) {
      print('wey testFuture args $args');
      Future.delayed(const Duration(seconds: 2), () {
        callback('abac');
      });
    });

    _registerToCtx(ctx, reg, controller);
  }

  static void disposeContext(int ctxAddr) {
    final timers = _contextTimers.remove(ctxAddr);
    if (timers != null) {
      for (final timer in timers.values) {
        timer.cancel();
      }
    }
  }

  static _registerToCtx(
    QuickJsContext ctx,
    JsHandlerRegistry reg,
    FuickAppController controller,
  ) {
    ctx.global.defineProperty('dartCallNative', (method, args) {
      return _handleCallNative(method, args, reg, controller);
    });

    // 统一使用 defineProperty 注册，JS 侧调用时直接返回 Promise
    ctx.global.defineProperty('dartCallNativeAsync', (method, args) {
      final h = reg.defer[method];
      if (h != null) {
        // 返回一个 Future，JS 侧会自动得到一个 Promise
        final completer = Completer();
        h(
          args,
          (res) {
            completer.complete(res);
          },
          (e) {
            completer.completeError(e);
          },
        );
        return completer.future;
      }
      return Future.error('method $method not found');
    });
  }

  static dynamic _handleCallNative(
    dynamic method,
    dynamic args,
    JsHandlerRegistry reg,
    FuickAppController controller,
  ) {
    try {
      if (method == 'renderUI') {
        final List listArgs = args is List ? args : [args];
        if (listArgs.length == 1 && listArgs[0] is Map) {
          final m = listArgs[0] as Map;
          final pageId = (m['pageId'] as num?)?.toInt();
          final renderData =
              (m['renderData'] as Map?)?.cast<String, dynamic>() ??
                  const <String, dynamic>{};
          if (pageId != null) {
            controller.render(pageId, renderData);
            return true;
          }
        }
      } else if (method == 'patchUI') {
        final List listArgs = args is List ? args : [args];
        if (listArgs.length == 1 && listArgs[0] is Map) {
          final m = listArgs[0] as Map;
          final pageId = (m['pageId'] as num?)?.toInt();
          final patches = (m['patches'] as List?) ?? [];
          if (pageId != null) {
            controller.patch(pageId, patches);
            return true;
          }
        }
      }
      final h = reg.sync[method];
      if (h != null) {
        return h(args);
      }
    } catch (e, s) {
      debugPrint("failed to callNative $e , $s");
    }
    return null;
  }
}
