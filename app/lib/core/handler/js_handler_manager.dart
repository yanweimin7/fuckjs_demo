import 'dart:async';

import 'package:flutter/cupertino.dart';

import '../container/fuick_app_controller.dart';
import '../engine/jscontext_interface.dart';
import '../service/BaseFuickService.dart';
import '../service/console_service.dart';
import '../service/navigation_service.dart';
import '../service/timer_service.dart';
import '../service/ui_service.dart';
import 'js_handler_registry.dart';

typedef ServiceBuilder = BaseFuickService Function();

class NativeServiceBinder {
  final List<ServiceBuilder> _serviceBuilders = [];
  List<BaseFuickService> _services = [];

  void _registerService(ServiceBuilder serviceBuilder) {
    _serviceBuilders.add(serviceBuilder);
  }

  void init(IQuickJsContext ctx, FuickAppController controller) {
    _registerService(() => TimerService());
    _registerService(() => ConsoleService());
    _registerService(() => NavigationService());
    _registerService(() => UIService());

    _services = _serviceBuilders.map((builder) {
      final service = builder();
      service.init(ctx, controller);
      return service;
    }).toList();

    ///todo: 优化，换成xxx.xxx格式
    final Map<String, SyncMethodHandler> handlers = {};
    _services.forEach((e) {
      handlers.addAll(e.syncMethods);
    });

    ctx.onCallNative = (method, args) {
      try {
        final h = handlers[method];
        if (h != null) {
          return h(args);
        }
      } catch (e, s) {
        debugPrint("failed to callNative $e , $s");
      }
      return null;
    };
  }

  void dispose() {
    for (final service in _services) {
      service.dispose();
    }
  }
}

class JsHandlerManager {
  static registerHandlers(IQuickJsContext ctx, FuickAppController controller) {
    // // 这里保留一些特殊的或者临时的 handler
    // reg.onDefer('testFuture', (args, callback, reject) {
    //   print('wey testFuture args $args');
    //   Future.delayed(const Duration(seconds: 2), () {
    //     callback('abac');
    //   });
    // });

    // _registerToCtx(ctx, reg, controller);
  }

  static _registerToCtx(
    IQuickJsContext ctx,
    JsHandlerRegistry reg,
    FuickAppController controller,
  ) {
    ctx.onCallNativeAsync = (method, args) async {
      final h = reg.defer[method];
      if (h != null) {
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
      // 如果 syncMethods 中有异步方法，dartCallNativeAsync 也会处理返回的 Future
      final syncH = reg.sync[method];
      if (syncH != null) {
        return syncH(args);
      }
      return Future.error('method $method not found');
    };
  }
}
