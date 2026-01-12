import 'dart:async';
import 'dart:ffi';

import 'package:flutter/services.dart';

import 'jscontext_interface.dart';
import 'jsobject.dart';
import 'quickjs_ffi.dart';

/**
 * QuickJS 上下文封装
 * 提供代码执行和环境管理能力
 */
class QuickJsContext implements IQuickJsContext {
  final QuickJsFFI _ffi;
  final Pointer<Void> _runtimeHandle;
  final Pointer<Void> _handle;
  late final JSObject global;

  FutureOr<dynamic> Function(String method, dynamic args)? _onCallNative;
  FutureOr<dynamic> Function(String method, dynamic args)? _onCallNativeAsync;

  @override
  set onCallNative(
    FutureOr<dynamic> Function(String method, dynamic args)? callback,
  ) {
    // Set up native call forwarding to main isolate
    _onCallNative = callback;
    if (callback != null) {
      global.defineProperty('dartCallNative', (method, args) {
        return _onCallNative?.call(method, args);
      });
    }
  }

  @override
  set onCallNativeAsync(
    FutureOr<dynamic> Function(String method, dynamic args)? callback,
  ) {
    _onCallNativeAsync = callback;
    if (callback != null) {
      global.defineProperty('dartCallNativeAsync', (method, args) {
        return _onCallNativeAsync?.call(method, args);
      });
    }
  }

  // 用于在 FFI 静态回调中寻找 Context 实例
  static final Map<int, QuickJsContext> instances = {};

  @override
  int get handleAddress => _handle.address;

  QuickJsContext(this._ffi, this._runtimeHandle)
      : _handle = _ffi.createContext(_runtimeHandle) {
    _ffi.initDefaultBindings(_handle);
    instances[_handle.address] = this;
    final globalRes = _ffi.getGlobalObject(_handle);
    global = JSObject(_ffi, _handle, globalRes);
  }

  @override
  Future<dynamic> eval(String code) async {
    return _ffi.eval(_handle, code);
  }

  @override
  Future<dynamic> evalBinary(Uint8List bytecode) async {
    return _ffi.evalWithBinary(_handle, bytecode);
  }

  String evalToString(String code) {
    final res = _ffi.eval(_handle, code);
    return res?.toString() ?? 'null';
  }

  /**
   * 手动触发任务执行
   */
  @override
  Future<int> runJobs() async {
    return _ffi.runJobs(_runtimeHandle, _handle);
  }

  @override
  void dispose() {
    instances.remove(_handle.address);
    JSObject.clearContextState(_handle.address);
    _ffi.destroyContext(_handle);
  }

  @override
  dynamic invoke(
    String? objectName,
    String methodName,
    List<dynamic> args,
  ) {
    if (objectName == null) {
      return global.invoke(methodName, args);
    }
    final obj = global.getProperty(objectName);
    if (obj is JSObject) {
      return obj.invoke(methodName, args);
    }
    return null;
  }

  @override
  Future evalBinaryFile(String path) async {
    final ByteData data = await rootBundle.load(path);
    final Uint8List bytes = data.buffer.asUint8List(
      data.offsetInBytes,
      data.lengthInBytes,
    );
    return await evalBinary(bytes);
  }

  @override
  Future evalFile(String path) async {
    final String code = await rootBundle.loadString(path);
    return await eval(code);
  }
}
