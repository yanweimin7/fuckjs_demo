import 'dart:async';
import 'dart:isolate';
import 'dart:typed_data';

import 'package:flutter/foundation.dart';

import 'engine.dart';
import 'jscontext.dart';

class IsolateManager {
  static IsolateManager? instance;

  final SendPort mainSendPort;

  final Map<String, QuickJsContext> contexts = {};

  IsolateManager(this.mainSendPort) {
    if (EngineInit.qjs == null) {
      EngineInit.initQjs();
    }
  }

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
    try {
      if (type == 'createContext') {
        if (!contexts.containsKey(contextId)) {
          if (EngineInit.runtime == null) {
            EngineInit.initQjs();
          }
          if (EngineInit.runtime == null) {
            throw Exception("Failed to initialize QuickJS runtime in isolate");
          }

          final ctx = EngineInit.runtime!.createContext();
          contexts[contextId] = ctx;
          ctx.onCallNative = (method, args) {
            print("wine ctx oncallnative $method ,$args");
            final responsePort = ReceivePort();

            ///发消息给main isolate，执行service方法
            mainSendPort.send({
              'contextId': contextId,
              'type': 'callNative',
              'replyPort': responsePort.sendPort,
              'payload': {'method': method, 'args': args},
            });
            return _waitForResponse(responsePort);
          };

          ctx.onCallNativeAsync = (method, args) {
            final responsePort = ReceivePort();
            mainSendPort.send({
              'contextId': contextId,
              'type': 'callNativeAsync',
              'replyPort': responsePort.sendPort,
              'payload': {'method': method, 'args': args},
            });
            return _waitForResponse(responsePort);
          };

          // Inject a flag to indicate that we are running in an Isolate
          await ctx.eval('globalThis.__IS_ISOLATE__ = true;');
        }
        mainSendPort.send({'type': 'response', 'id': id, 'payload': null});
        return;
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
        await ctx.runJobs();
      } else if (type == 'evalBinary') {
        result = await ctx!.evalBinary(payload as Uint8List);
        await ctx.runJobs();
      } else if (type == 'runJobs') {
        result = await ctx!.runJobs();
      } else if (type == 'invoke') {
        final objectName = payload['objectName'] as String?;
        final methodName = payload['methodName'] as String;
        final args = payload['args'] as List;
        result = await ctx!.invoke(objectName, methodName, args);
        print("wine resut $result");
        await ctx.runJobs();
      } else if (type == 'disposeContext') {
        if (ctx != null) {
          ctx.dispose();
          contexts.remove(contextId);
        }
        result = null;
      }

      mainSendPort.send({
        'contextId': contextId,
        'type': 'response',
        'id': id,
        'payload': result,
      });
    } catch (e, s) {
      print("Error in IsolateManager.handleMessage: $e\n$s");
      mainSendPort.send({
        'contextId': contextId,
        'type': 'response',
        'id': id,
        'payload': null,
        'error': e.toString(),
      });
    }
  }
}
