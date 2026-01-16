import 'dart:async';
import 'dart:convert';
import 'dart:isolate';
import 'dart:typed_data';

import '../handler/js_handler_manager.dart';
import '../service/console_service.dart';
import '../service/timer_service.dart';
import 'engine.dart';
import 'jscontext.dart';

class IsolateHandler {
  final SendPort mainSendPort;

  final Map<String, QuickJsContext> contexts = {};
  final Map<String, NativeServiceBinder> binders = {};

  // Track concurrent handleMessage calls
  int _activeMessageCount = 0;
  int _maxNestingLevel = 0;

  IsolateHandler(this.mainSendPort);

  Future<dynamic> _waitForResponse(ReceivePort port) async {
    final result = await port.first;
    port.close();
    return result;
  }

  void handleMessage(
    String contextId,
    String type,
    String id,
    dynamic payload,
  ) async {
    runZonedGuarded(
      () async {
        _activeMessageCount++;
        if (_activeMessageCount > _maxNestingLevel) {
          _maxNestingLevel = _activeMessageCount;
        }

        if (_activeMessageCount > 1) {
          print(
            "[Isolate Monitor] Parallel message detected! Count: $_activeMessageCount, Type: $type, Max Nesting: $_maxNestingLevel",
          );
        } else {
          print("[Isolate Monitor] Processing message: $type, id: $id");
        }

        // Ensure we always yield the stack before processing a message.
        // This prevents stack accumulation when messages are sent in a tight loop.
        await Future.microtask(() {});

        try {
          if (type == 'initEngine') {
            await EngineInit.initQjs();
            return;
          }
          if (type == 'createContext') {
            if (!contexts.containsKey(contextId)) {
              if (EngineInit.runtime == null) {
                throw Exception(
                  "Failed to initialize QuickJS runtime in isolate",
                );
              }
              final ctx = EngineInit.runtime!.createContext();
              contexts[contextId] = ctx;

              // Define helper for async invocation to break call stack
              // Moved to runtime.ts in JS framework
              // ctx.eval('''
              //   globalThis.__invokeAsync = (obj, method, ...args) => {
              //     return Promise.resolve().then(() => {
              //       const target = obj || globalThis;
              //       if (typeof target[method] === 'function') {
              //         return target[method](...args);
              //       }
              //     });
              //   };
              // ''');

              final binder = NativeServiceBinder();
              binders[contextId] = binder;
              // Only register services that can run in isolate
              binder.init(
                ctx,
                null,
                allowedServices: [TimerService, ConsoleService],
              );

              ctx.onCallNative = (method, args) {
                try {
                  // Try local binder first
                  if (binder.canHandle(method)) {
                    return binder.handleNativeCall(method, args);
                  }

                  // Forward to main isolate
                  final responsePort = ReceivePort();
                  mainSendPort.send({
                    'contextId': contextId,
                    'type': 'callNative',
                    'replyPort': responsePort.sendPort,
                    'payload': {'method': method, 'args': args},
                  });
                  return _waitForResponse(responsePort);
                } catch (e, s) {
                  print("Isolate onCallNative error: $e\n$s");
                  rethrow;
                }
              };

              ctx.onCallNativeAsync = (method, args) {
                // Forward to main isolate
                final responsePort = ReceivePort();
                mainSendPort.send({
                  'contextId': contextId,
                  'type': 'callNativeAsync',
                  'replyPort': responsePort.sendPort,
                  'payload': {'method': method, 'args': args},
                });
                return _waitForResponse(responsePort);
              };

              mainSendPort.send({
                'type': 'response',
                'id': id,
                'payload': null,
              });
              return;
            }
          }

          final ctx = contexts[contextId];
          if (ctx == null && type != 'disposeContext') {
            mainSendPort.send({
              'type': 'response',
              'id': id,
              'payload': null,
              'error': 'Context not found: $contextId',
            });
            return;
          }

          dynamic result;
          if (type == 'eval') {
            result = await ctx!.eval(payload as String);
          } else if (type == 'evalBinary') {
            result = await ctx!.evalBinary(payload as Uint8List);
          } else if (type == 'runJobs') {
            result = await ctx!.runJobs();
          } else if (type == 'invoke') {
            final objectName = payload['objectName'] as String?;
            final methodName = payload['methodName'] as String;
            final args = payload['args'] as List;
            result = await ctx!.invoke(objectName, methodName, args);
          } else if (type == 'disposeContext') {
            if (ctx != null) {
              contexts.remove(contextId);
              binders.remove(contextId)?.dispose();
              ctx.dispose();
            }
            result = null;
          }

          mainSendPort.send({
            'contextId': contextId,
            'type': 'response',
            'id': id,
            'payload': result,
          });
        } finally {
          _activeMessageCount--;
        }
      },
      (e, s) {
        print("Error in IsolateManager.handleMessage: $e\n$s");
        mainSendPort.send({
          'contextId': contextId,
          'type': 'response',
          'id': id,
          'payload': null,
          'error': e.toString(),
        });
      },
    );
  }
}
