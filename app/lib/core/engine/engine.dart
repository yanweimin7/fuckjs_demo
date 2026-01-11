import 'package:flutter/cupertino.dart';
import 'package:flutter_quickjs/core/engine/runtime.dart';
import 'package:flutter_quickjs/core/engine/worker.dart';

import 'quickjs_ffi.dart';

class EngineInit {
  static QuickJsFFI? _qjs;

  static QuickJsFFI? get qjs => _qjs;
  static QuickJsRuntime? runtime;

  static initQjs() {
    if (_qjs == null) {
      try {
        final lib = QuickJsFFI.load();
        _qjs = QuickJsFFI(lib);
        runtime = QuickJsRuntime(_qjs!);
      } catch (e) {
        debugPrint('初始化错误: $e');
        runtime = null;
      }
    }
  }

  static Future<void> initIsolate() async {
    await IsolateWorker.instance.ensureInitialized();
  }

  static void setUseBinaryProtocol(bool use) {
    _qjs?.setUseBinaryProtocol(use);
  }
}
