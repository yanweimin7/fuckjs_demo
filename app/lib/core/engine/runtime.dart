import 'dart:ffi';

import 'package:flutter_quickjs/core/engine/quickjs_ffi.dart';

import 'jscontext.dart';

/**
 * QuickJS Runtime 封装
 * 每个 Runtime 对应一个 JS 引擎实例，拥有独立的内存堆
 */
class QuickJsRuntime {
  final QuickJsFFI _ffi;
  final Pointer<Void> _handle;

  QuickJsRuntime(this._ffi) : _handle = _ffi.createRuntime();

  /**
   * 创建一个相互隔离的上下文
   */
  QuickJsContext createContext() {
    return QuickJsContext(_ffi, _handle);
  }

  void dispose() {
    _ffi.destroyRuntime(_handle);
  }
}
