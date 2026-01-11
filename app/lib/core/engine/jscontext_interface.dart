import 'dart:async';
import 'dart:typed_data';

abstract class IQuickJsContext {
  Future<dynamic> eval(String code);
  Future<dynamic> evalBinary(Uint8List bytecode);
  Future<dynamic> evalFile(String path);
  Future<dynamic> evalBinaryFile(String path);
  Future<int> runJobs();
  void dispose();
  int get handleAddress;

  /// 在全局对象上调用方法 (由具体实现决定如何处理)
  Future<dynamic> invoke(
    String? objectName,
    String methodName,
    List<dynamic> args,
  );

  /// Callback to handle sync native calls from JS
  set onCallNative(
    FutureOr<dynamic> Function(String method, dynamic args)? callback,
  );

  /// Callback to handle async native calls from JS
  set onCallNativeAsync(
    FutureOr<dynamic> Function(String method, dynamic args)? callback,
  );
}
