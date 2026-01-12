import 'package:flutter/foundation.dart';
import '../container/fuick_app_controller.dart';
import '../engine/jscontext_interface.dart';

typedef SyncMethodHandler = dynamic Function(dynamic args);

abstract class BaseFuickService {
  final Map<String, SyncMethodHandler> syncMethods = {};

  late IQuickJsContext ctx;
  FuickAppController? controller;
  bool _isDisposed = false;
  bool get isDisposed => _isDisposed;

  void init(IQuickJsContext context, FuickAppController? appController) {
    ctx = context;
    controller = appController;
    _isDisposed = false;
  }

  void registerMethod(String method, SyncMethodHandler handler) {
    syncMethods[method] = (args) {
      if (_isDisposed) {
        debugPrint(
            '[Service] Warning: Calling method $method on disposed service');
        return null;
      }
      return handler(args);
    };
  }

  void dispose() {
    _isDisposed = true;
    syncMethods.clear();
  }
}
