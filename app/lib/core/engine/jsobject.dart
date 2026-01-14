import 'dart:ffi';

import 'package:ffi/ffi.dart' as ffi;
import 'package:flutter/foundation.dart';

import 'jscontext.dart';
import 'quickjs_ffi.dart';

class JSObject {
  final QuickJsFFI _ffi;
  final Pointer<Void> _contextHandle;
  final Pointer<QjsResult> _handle;

  JSObject(this._ffi, this._contextHandle, this._handle) {
    _finalizer.attach(this, _handle, detach: this);
  }

  static final Finalizer<Pointer<QjsResult>> _finalizer = Finalizer((ptr) {
    QuickJsFFI.globalInstance?.freeQjsResult(ptr);
  });

  void setProperty(String name, dynamic value) {
    final valRes = ffi.calloc<QjsResult>();
    QuickJsFFI.writeOut(valRes, value);
    _ffi.setProperty(_contextHandle, _handle, name, valRes);
    _ffi.freeQjsResult(valRes);
  }

  dynamic getProperty(String name) {
    final res = _ffi.getProperty(_contextHandle, _handle, name);
    final dartVal = QuickJsFFI.convertQjsResultToDart(res.ref);
    if (res.ref.type == qjsTypeObject || res.ref.type == qjsTypeFunction) {
      // 如果是对象或函数，返回 JSObject 封装以支持链式操作
      return JSObject(_ffi, _contextHandle, res);
    }
    _ffi.freeQjsResult(res);
    return dartVal;
  }

  ///eval返回一个function的情况下，可以使用它来执行
  dynamic callFunction(List<dynamic> args) {
    return _ffi.callFunction(_contextHandle, _handle, args);
  }

  dynamic invoke(String name, List<dynamic> args) {
    return _ffi.invokeMethod(_contextHandle, _handle, name, args);
  }

  /**
   * 在 JS 对象上定义一个方法，该方法执行时会回调 Dart 函数
   */
  void defineProperty(String name, Function callback) {
    final key = "${_contextHandle.address}_$name";
    if (_callbacks.containsKey(key)) {
      _callbacks[key] = callback;
      return;
    }

    // 注册 C 侧蹦床函数
    final trampoline = Pointer.fromFunction<NativeAsyncTypedCallHandler>(
      _jsNativeCallTrampoline,
    );
    final fnRes = _ffi.newFunction(_contextHandle, name, trampoline);
    _ffi.setProperty(_contextHandle, _handle, name, fnRes);

    // 保存回调以防止被 Dart GC，并用于静态方法查找
    _callbacks[key] = callback;
    _ffi.freeQjsResult(fnRes);
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
