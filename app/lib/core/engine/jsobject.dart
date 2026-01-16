import 'dart:async';
import 'dart:ffi';

import 'package:ffi/ffi.dart' as ffi;
import 'package:flutter/foundation.dart';
import 'package:flutter_quickjs/core/engine/quickjs_ffi.dart';

import 'jscontext.dart';

class JSObjectToken {
  final Pointer<QjsResult> handle;
  final QuickJsContext context;
  bool isDisposed = false;
  JSObjectToken(this.handle, this.context);
}

class JSObject {
  final QuickJsContext context;
  final Pointer<QjsResult> _handle;
  final JSObjectToken _token;
  bool _disposed = false;

  JSObject(this.context, this._handle)
      : _token = JSObjectToken(_handle, context) {
    context.registerObject(_token);
    // Increase context reference count to ensure it stays alive until this object is finalized
    context.ffi.contextIncref(context.handle);
    _finalizer.attach(this, _token, detach: this);
  }

  static final Finalizer<JSObjectToken> _finalizer = Finalizer((token) {
    if (token.isDisposed) return;
    token.isDisposed = true;
    token.context.unregisterObject(token);

    // We can safely call freeObject because the context uses ref-counting
    token.context.ffi.freeObject(token.context.handle, token.handle);
    token.context.ffi.freeQjsResult(token.handle);
  });

  void dispose() {
    if (_disposed) return;
    _disposed = true;
    // 1. 主动销毁时，移除 Finalizer 监听，防止 GC 时再次触发回调
    _finalizer.detach(this);

    // 2. 检查 token 是否已被销毁 (可能是由 Context.dispose 触发的)
    if (_token.isDisposed) return;
    _token.isDisposed = true;
    context.unregisterObject(_token);

    // freeObject will decrease context ref count and free JSValue
    context.ffi.freeObject(context.handle, _handle);
    context.ffi.freeQjsResult(_handle);
  }

  void setProperty(String name, dynamic value) {
    if (_disposed || _token.isDisposed) return;
    final valRes = ffi.calloc<QjsResult>();
    QuickJsFFI.writeOut(valRes, value);
    context.ffi.setProperty(context.handle, _handle, name, valRes);
    context.ffi.freeQjsResult(valRes);
  }

  dynamic getProperty(String name) {
    if (_disposed || _token.isDisposed) return null;
    final res = context.ffi.getProperty(context.handle, _handle, name);
    final dartVal = QuickJsFFI.convertQjsResultToDart(res.ref);
    if (res.ref.type == qjsTypeObject || res.ref.type == qjsTypeFunction) {
      // 如果是对象或函数，返回 JSObject 封装以支持链式操作
      return JSObject(context, res);
    }
    context.ffi.freeQjsResult(res);
    return dartVal;
  }

  ///eval返回一个function的情况下，可以使用它来执行
  dynamic callFunction(List<dynamic> args) {
    if (_disposed || _token.isDisposed) return null;
    return context.ffi.callFunction(context.handle, _handle, args);
  }

  dynamic invoke(String name, List<dynamic> args) {
    if (_disposed || _token.isDisposed) return null;
    // print("[JS Invocation] Entering invoke: $name with ${args.length} args");
    try {
      return context.ffi.invokeMethod(context.handle, _handle, name, args);
    } finally {
      // print("[JS Invocation] Leaving invoke: $name");
    }
  }

  /**
   * 在 JS 对象上定义一个方法，该方法执行时会回调 Dart 函数
   */
  void defineProperty(String name, Function callback) {
    if (_disposed || _token.isDisposed) return;
    final key = "${context.handle.address}_$name";
    if (_callbacks.containsKey(key)) {
      _callbacks[key] = callback;
      return;
    }

    // 注册 C 侧蹦床函数
    final trampoline = Pointer.fromFunction<NativeAsyncTypedCallHandler>(
      _jsNativeCallTrampoline,
    );
    final fnRes = context.ffi.newFunction(context.handle, name, trampoline);
    context.ffi.setProperty(context.handle, _handle, name, fnRes);

    // 保存回调以防止被 Dart GC，并用于静态方法查找
    _callbacks[key] = callback;

    // newFunction 返回的 JSValue (fnRes) 引用计数为 1
    // setProperty 会调用 JS_DupValue，导致引用计数 +1
    // 因此我们需要释放 fnRes 持有的引用，否则会导致内存泄漏
    context.ffi.freeValue(context.handle, fnRes);
    context.ffi.freeQjsResult(fnRes);
  }

  /**
   * 清除特定 Context 的所有状态 (回调和异步解析器)
   */
  static void clearContextState(int contextAddress) {
    _callbacks.removeWhere((key, _) => key.startsWith("${contextAddress}_"));
    pendingResolvers.remove(contextAddress);
    pendingRejections.remove(contextAddress);
  }

  // 存储所有已注册的 Dart 回调 (Key: contextAddress_methodName)
  static final Map<String, Function> _callbacks = {};

  /**
   * JS 调用 Dart 的核心蹦床函数 (FFI 静态方法)
   */
  static void _jsNativeCallTrampoline(
    Pointer<Void> contextHandle,
    NativeUtf8Ptr methodPtr,
    Pointer<QjsResult> argsPtr,
    int argc,
    Pointer<QjsResult> out,
  ) {
    final method = methodPtr.toDartString();
    final key = "${contextHandle.address}_$method";
    final callback = _callbacks[key];

    if (callback == null) {
      debugPrint("[Dart] Method not found: $method (key: $key)");
      out.ref.error = 1;
      out.ref.s = 'Method not found: $method'.toNativeUtf8();
      return;
    }

    final args = [];
    for (var i = 0; i < argc; i++) {
      args.add(QuickJsFFI.convertQjsResultToDart(argsPtr[i]));
    }
    try {
      final result = Function.apply(callback, args);

      // 特殊处理 Future: 将其映射为 JS Promise
      if (result is Future) {
        final id = _nextResolverId++;
        out.ref.type = qjsTypePromise;
        out.ref.i64 = id;
        result.then((value) {
          pendingResolvers.putIfAbsent(
            contextHandle.address,
            () => {},
          )[id] = value;
          // 关键：Future 完成后，利用微任务触发 runJobs 以推进 JS Promise 状态
          Future.microtask(() {
            QuickJsContext.instances[contextHandle.address]?.runJobs();
          });
        }).catchError((e) {
          pendingRejections.putIfAbsent(
            contextHandle.address,
            () => {},
          )[id] = e.toString();
          Future.microtask(() {
            QuickJsContext.instances[contextHandle.address]?.runJobs();
          });
        });
      } else {
        // 同步返回值
        QuickJsFFI.writeOut(out, result);
      }
    } catch (e) {
      out.ref.error = 1;
      out.ref.s = e.toString().toNativeUtf8();
    }
  }

  static int _nextResolverId = 1;

  // 待处理的异步结果 (contextAddress -> resolverId -> result)
  static final Map<int, Map<int, dynamic>> pendingResolvers = {};
  static final Map<int, Map<int, String>> pendingRejections = {};
}
