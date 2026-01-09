import 'package:flutter/cupertino.dart';
import 'package:flutter_quickjs/core/engine/runtime.dart';

import 'quickjs_ffi.dart';

class Engine {
  static QuickJsFFI? _qjs;
  static QuickJsFFI? get qjs => _qjs;
  static QuickJsRuntime? runtime;

  static initQjs() {
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
