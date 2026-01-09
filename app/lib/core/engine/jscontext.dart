import 'dart:ffi';
import 'dart:typed_data';

import 'jsobject.dart';
import 'quickjs_ffi.dart';

/**
 * QuickJS 上下文封装
 * 提供代码执行和环境管理能力
 */
class QuickJsContext {
  final QuickJsFFI _ffi;
  final Pointer<Void> _runtimeHandle;
  final Pointer<Void> _handle;
  late final JSObject global;

  // 用于在 FFI 静态回调中寻找 Context 实例
  static final Map<int, QuickJsContext> instances = {};

  int get handleAddress => _handle.address;

  QuickJsContext(this._ffi, this._runtimeHandle)
    : _handle = _ffi.createContext(_runtimeHandle) {
    instances[_handle.address] = this;
    final globalRes = _ffi.getGlobalObject(_handle);
    global = JSObject(_ffi, _handle, globalRes);
  }

  dynamic eval(String code) {
    return _ffi.eval(_handle, code);
  }

  dynamic evalBinary(Uint8List bytecode) {
    return _ffi.evalWithBinary(_handle, bytecode);
  }

  String evalToString(String code) {
    final res = eval(code);
    return res?.toString() ?? 'null';
  }

  /**
   * 手动触发任务执行
   */
  int runJobs() {
    return _ffi.runJobs(_runtimeHandle, _handle);
  }

  void dispose() {
    instances.remove(_handle.address);
    JSObject.clearContextState(_handle.address);
    _ffi.destroyContext(_handle);
  }
}
