import 'dart:async';
import 'dart:ffi';

import 'package:flutter/cupertino.dart';
import 'package:flutter_quickjs/core/engine/quickjs_ffi.dart';

import 'jscontext.dart';

/// QuickJS Runtime 封装
/// 每个 Runtime 对应一个 JS 引擎实例，拥有独立的内存堆
class QuickJsRuntime {
  final QuickJsFFI _ffi;
  final Pointer<Void> _handle;
  NativeCallable<Void Function(Pointer<Void>)>? _onEnqueueJobCallback;
  bool _isJobPending = false;

  QuickJsRuntime(this._ffi) : _handle = _ffi.createRuntime() {
    _ffi.setMaxStackSize(_handle, 0);
    _initEnqueueJob();
  }

  void _initEnqueueJob() {
    _onEnqueueJobCallback =
        NativeCallable<Void Function(Pointer<Void>)>.listener((
          Pointer<Void> rt,
        ) {
          if (_isJobPending) return;
          _isJobPending = true;

          // Use microtask instead of Future() for faster Promise resolution
          scheduleMicrotask(() {
            _isJobPending = false;
            executePendingJobs();
          });
        });
    _ffi.setOnEnqueueJob(_handle, _onEnqueueJobCallback!.nativeFunction);
  }

  /// 创建一个相互隔离的上下文
  QuickJsContext createContext() {
    debugPrint('create js context');
    return QuickJsContext(_ffi, _handle);
  }

  void executePendingJobs() {
    _ffi.runJobs(_handle, nullptr);
  }

  void dispose() {
    debugPrint('dispose js context');
    _onEnqueueJobCallback?.close();
    _ffi.destroyRuntime(_handle);
  }
}
