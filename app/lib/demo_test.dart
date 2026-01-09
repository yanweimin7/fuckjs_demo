import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_quickjs/core/engine/quickjs_ffi.dart';
import 'package:flutter_quickjs/core/handler/js_handler_registry.dart';

import 'core/engine/jscontext.dart';
import 'core/engine/runtime.dart';

class QuickJsDemoPage extends StatefulWidget {
  const QuickJsDemoPage({super.key});

  @override
  State<QuickJsDemoPage> createState() => _QuickJsDemoPageState();
}

class _QuickJsDemoPageState extends State<QuickJsDemoPage> {
  String _result = '';
  late final QuickJsFFI _qjs;
  QuickJsRuntime? _runtime;
  QuickJsContext? _ctx1;
  QuickJsContext? _ctx2;

  @override
  void initState() {
    super.initState();
    try {
      final lib = QuickJsFFI.load();
      _qjs = QuickJsFFI(lib);
      _runtime = QuickJsRuntime(_qjs);
      _ctx1 = _runtime!.createContext();
      _ctx2 = _runtime!.createContext();

      // 使用新的 defineProperty 语法注册全局方法
      _ctx1!.global.defineProperty('sum', (a, b) {
        return (a is num ? a : 0) + (b is num ? b : 0);
      });

      _ctx1!.global.defineProperty('echo', (args) {
        return args;
      });

      _ctx1!.global.defineProperty('console_log', (msg) {
        debugPrint('JS Console: $msg');
      });

      // 异步方法测试
      _ctx1!.global.defineProperty('asyncSum', (a, b) async {
        await Future.delayed(const Duration(milliseconds: 500));
        return (a is num ? a : 0) + (b is num ? b : 0);
      });

      final _ = JsHandlerRegistry(_ctx2!);
    } catch (e) {
      setState(() {
        _result = '初始化错误: $e';
      });
      _runtime = null;
      _ctx1 = null;
      _ctx2 = null;
    }
  }

  @override
  void dispose() {
    if (_ctx1 != null) {
      _ctx1!.dispose();
    }
    if (_ctx2 != null) {
      _ctx2!.dispose();
    }
    if (_runtime != null) {
      _runtime!.dispose();
    }
    super.dispose();
  }

  void _runScript() {
    if (_ctx1 == null || _ctx2 == null) return;
    final buf = StringBuffer();

    // 测试 Map 和 List 的直接传递 (二进制协议)
    try {
      final testData = {
        'map': {
          'a': 1,
          'b': [2, 3],
        },
        'list': [
          1,
          {'x': 'y'},
          3.14,
        ],
        'str': 'hello',
        'bool': true,
        'null': null,
      };

      final result = _ctx1!.evalToString('''
        var data = ${jsonEncode(testData)};
        JSON.stringify(data);
      ''');
      buf.writeln('Eval Map/List Test: $result');

      // 测试 echo 处理器 (Dart -> JS -> Dart -> JS)
      _ctx1!.eval('''
        var echoed = echo({ list: [1, 2, 3], map: { key: "value" } });
        globalThis.echoResult = JSON.stringify(echoed);
      ''');
      final echoRes = _ctx1!.evalToString('globalThis.echoResult');
      buf.writeln('Echo Handler Test: $echoRes');
    } catch (e) {
      buf.writeln('Test Error: $e');
    }

    _ctx1!.eval('''
      (function(){
        if(!globalThis.console){globalThis.console={};}
        globalThis.console.log=function(){
          var arr=[];
          for(var i=0;i<arguments.length;i++){
            var a=arguments[i];
            if(typeof a==="string"){
              arr.push(a);
             } else {
                   try{
                     arr.push(JSON.stringify(a));
                     }
                   catch(e){
                   arr.push(String(a));
                   }
                   }
          }
          console_log(arr.join(" "))
        };
      })()
    ''');
    final v1 = _ctx1!.eval('1 + 2');
    buf.writeln('eval(1+2) = $v1');
    final v2 = _ctx1!.eval('0.1 + 0.2');
    buf.writeln('eval(0.1+0.2) = $v2');
    final b1 = _ctx1!.eval('true');
    final b2 = _ctx1!.eval('false');
    final n1 = _ctx1!.eval('null');
    final u1 = _ctx1!.eval('undefined');
    buf.writeln('eval(true) = $b1');
    buf.writeln('eval(false) = $b2');
    buf.writeln('eval(null) = $n1');
    buf.writeln('eval(undefined) = $u1');
    final s1 = _ctx1!.eval('"hello"');
    buf.writeln('eval("hello") = $s1');
    final o1 = _ctx1!.eval('({ a: 1, b: 2 })');
    buf.writeln('eval(object) = $o1');
    final p1 = _ctx1!.eval('Promise.resolve(5)');
    buf.writeln('eval(Promise.resolve(5)) = $p1');
    final p2 = _ctx1!.eval('Promise.resolve({x:42})');
    buf.writeln('eval(Promise.resolve({x:42})) = $p2');
    String e1 = '';
    try {
      _ctx1!.eval('throw new Error("boom")');
    } catch (e) {
      e1 = '$e';
    }
    buf.writeln('eval(throw) = $e1');
    final j1 = _ctx1!.evalToString('JSON.stringify({ x: 42 })');
    buf.writeln('evalToString(JSON) = $j1');
    final c1 = _ctx1!.eval('sum(3, 4)');
    buf.writeln('eval(sum(3, 4)) = $c1');
    _ctx1!.eval(
      'asyncSum(10, 20).then(v => console.log("asyncSum result:", v))',
    );
    buf.writeln('启动异步 sum: then 会在稍后打印');

    // 测试通过 global.invoke 直接调用方法
    try {
      final res = _ctx1!.global.invoke('sum', [1000, 2000]);
      buf.writeln('global.invoke(sum, [1000, 2000]) = $res');
    } catch (e) {
      buf.writeln('global.invoke Test Error: $e');
    }

    _ctx2!.eval('''
      (function(){
        if(!globalThis.console){globalThis.console={};}
        globalThis.console.log=function(){
          var arr=[];
          for(var i=0;i<arguments.length;i++){
            var a=arguments[i];
            if(typeof a==="string"){
              arr.push(a);
             } else {
                   try{
                     arr.push(JSON.stringify(a));
                     }
                   catch(e){
                   arr.push(String(a));
                   }
                   }
          }
          dartCallTyped("console_log", JSON.stringify(arr.join(" ")))
        };
      })()
    ''');
    _ctx1!.eval('var onlyCtx1 = 123;');
    final ctx1Has = _ctx1!.eval('typeof onlyCtx1');
    final ctx2Has = _ctx2!.eval('typeof onlyCtx1');
    buf.writeln('ctx1 typeof onlyCtx1 = $ctx1Has');
    buf.writeln('ctx2 typeof onlyCtx1 = $ctx2Has');

    setState(() {
      _result = buf.toString();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('QuickJS 测试页')),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Text(_result, textAlign: TextAlign.center),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _runScript,
        tooltip: '运行测试脚本',
        child: const Icon(Icons.play_arrow_outlined),
      ),
    );
  }
}
