import 'dart:async';
import 'dart:isolate';

import 'package:easy_isolate/easy_isolate.dart';

import 'isolate_manager.dart';
import 'jscontext_delegate.dart';

/// Manages a single Isolate that can host multiple QuickJsContexts.
class IsolateWorker {
  static final IsolateWorker instance = IsolateWorker._internal();

  IsolateWorker._internal();

  final Worker _worker = Worker();
  final Completer<void> _ready = Completer<void>();
  bool _initialized = false;

  final Map<String, JsContextDelegate> _delegates = {};
  final Map<String, Completer<dynamic>> _pendingRequests = {};
  int _requestId = 0;

  Future<void> ensureInitialized() async {
    if (_initialized) return _ready.future;
    _initialized = true;
    await _worker.init(_mainHandler, _isolateHandler);
    _ready.complete();
  }

  void registerDelegate(JsContextDelegate delegate) {
    _delegates[delegate.contextId] = delegate;
  }

  void unregisterDelegate(String contextId) {
    _delegates.remove(contextId);
  }

  Future<dynamic> sendRequest(
    String contextId,
    String type,
    dynamic payload,
  ) async {
    await ensureInitialized();
    final id = '${_requestId++}';
    final completer = Completer<dynamic>();
    _pendingRequests[id] = completer;
    _worker.sendMessage({
      'contextId': contextId,
      'type': type,
      'id': id,
      'payload': payload,
    });

    return completer.future;
  }

  /// Main isolate handler for messages from child isolate
  FutureOr<void> _mainHandler(dynamic data, SendPort isolateSendPort) async {
    if (data is! Map) return;

    final contextId = data['contextId'] as String?;
    final type = data['type'];
    final id = data['id'];
    final payload = data['payload'];

    if (type == 'response') {
      final completer = _pendingRequests.remove(id);
      if (data['error'] != null) {
        completer?.completeError(data['error']);
      } else {
        completer?.complete(payload);
      }
    } else if (type == 'callNative' || type == 'callNativeAsync') {
      if (contextId == null) return;
      final delegate = _delegates[contextId];
      if (delegate == null) return;

      final method = payload['method'];
      final args = payload['args'];
      final replyPort = data['replyPort'] as SendPort?;

      final callback = (type == 'callNative')
          ? delegate.onCallNative
          : delegate.onCallNativeAsync;

      if (callback != null) {
        final result = await callback(method, args);
        replyPort?.send(result);
      } else {
        replyPort?.send(null);
      }
    }
  }

  static IsolateHandler? isolateHandler;

  /// Child isolate handler
  @pragma('vm:entry-point')
  static FutureOr<void> _isolateHandler(
    dynamic data,
    SendPort mainSendPort,
    SendErrorFunction onSendError,
  ) {
    isolateHandler ??= IsolateHandler(mainSendPort);
    if (data is! Map) return null;
    final contextId = data['contextId'] as String;
    final type = data['type'];
    final id = data['id'];
    final payload = data['payload'];
    isolateHandler!.handleMessage(contextId, type, id, payload);
    return null;
  }

  void dispose() {
    isolateHandler = null;
    _worker.dispose();
  }
}
