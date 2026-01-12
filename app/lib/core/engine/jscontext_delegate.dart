import 'dart:async';
import 'dart:typed_data';

import 'package:flutter/services.dart';
import 'package:flutter_quickjs/core/engine/worker.dart';

import 'jscontext_interface.dart';

class JsContextDelegate implements IQuickJsContext {
  final String contextId;

  // Callback to handle native calls in the main isolate
  FutureOr<dynamic> Function(String method, dynamic args)? _onCallNative;

  FutureOr<dynamic> Function(String method, dynamic args)? get onCallNative =>
      _onCallNative;

  FutureOr<dynamic> Function(String method, dynamic args)? _onCallNativeAsync;

  FutureOr<dynamic> Function(String method, dynamic args)?
      get onCallNativeAsync => _onCallNativeAsync;

  JsContextDelegate(this.contextId) {
    IsolateWorker.instance.registerDelegate(this);
  }

  @override
  set onCallNative(
    FutureOr<dynamic> Function(String method, dynamic args)? callback,
  ) {
    _onCallNative = callback;
  }

  @override
  set onCallNativeAsync(
    FutureOr<dynamic> Function(String method, dynamic args)? callback,
  ) {
    _onCallNativeAsync = callback;
  }

  @override
  int get handleAddress => identityHashCode(this);

  Future<void> init() async {
    await IsolateWorker.instance.sendRequest(contextId, 'createContext', null);
  }

  @override
  Future<dynamic> eval(String code) =>
      IsolateWorker.instance.sendRequest(contextId, 'eval', code);

  @override
  Future<dynamic> evalBinary(Uint8List bytecode) =>
      IsolateWorker.instance.sendRequest(contextId, 'evalBinary', bytecode);

  @override
  dynamic invoke(
    String? objectName,
    String methodName,
    List<dynamic> args,
  ) =>
      IsolateWorker.instance.sendRequest(contextId, 'invoke', {
        'objectName': objectName,
        'methodName': methodName,
        'args': args,
      });

  @override
  Future<int> runJobs() async {
    final res = await IsolateWorker.instance.sendRequest(
      contextId,
      'runJobs',
      null,
    );
    return res as int? ?? 0;
  }

  @override
  void dispose() {
    IsolateWorker.instance.sendRequest(contextId, 'disposeContext', null);
    IsolateWorker.instance.unregisterDelegate(contextId);
  }

  @override
  Future evalBinaryFile(String path) async {
    final ByteData data = await rootBundle.load(path);
    final Uint8List bytes = data.buffer.asUint8List(
      data.offsetInBytes,
      data.lengthInBytes,
    );
    return evalBinary(bytes);
  }

  @override
  Future evalFile(String path) async {
    final String code = await rootBundle.loadString(path);
    return eval(code);
  }
}
