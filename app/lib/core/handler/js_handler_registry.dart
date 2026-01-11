import '../engine/jscontext_interface.dart';

typedef SyncHandler = dynamic Function(dynamic args);
typedef DeferHandler = void Function(
  dynamic args,
  void Function(dynamic) resolve,
  void Function(dynamic) reject,
);

class JsHandlerRegistry {
  final IQuickJsContext ctx;
  final Map<String, SyncHandler> sync = {};
  final Map<String, DeferHandler> defer = {};
  JsHandlerRegistry(this.ctx);
  void onSync(String method, SyncHandler h) {
    sync[method] = h;
  }

  void onDefer(String method, DeferHandler h) {
    defer[method] = h;
  }
}
