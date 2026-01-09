import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_quickjs/core/handler/js_handler_registry.dart';
import 'package:flutter_quickjs/quickjs_ffi.dart';

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

      final reg1 = JsHandlerRegistry(_ctx1!);
      reg1.onSync('sum', (args) {
        final m =
            args is Map ? Map<String, dynamic>.from(args) : <String, dynamic>{};
        final a = m['a'] ?? 0;
        final b = m['b'] ?? 0;
        final s = (a is num ? a : 0) + (b is num ? b : 0);
        return {'result': s};
      });
      reg1.onSync('echo', (args) {
        return {'echo': args};
      });
      reg1.onAsync('sum', (args) {
        final m =
            args is Map ? Map<String, dynamic>.from(args) : <String, dynamic>{};
        final a = m['a'] ?? 0;
        final b = m['b'] ?? 0;
        final s = (a is num ? a : 0) + (b is num ? b : 0);
        return {'result': s};
      });
      reg1.onDefer('sum_error', (args, id) {
        // Future.delayed(const Duration(milliseconds: 300), () {
        //   _ctx1!.asyncRejectTyped(id, {'error': 'sum failed'});
        // });
      });
      reg1.onDefer('sum', (args, id) {
        final m =
            args is Map ? Map<String, dynamic>.from(args) : <String, dynamic>{};
        final a = m['a'] ?? 0;
        final b = m['b'] ?? 0;
        final s = (a is num ? a : 0) + (b is num ? b : 0);
        // Future.delayed(const Duration(milliseconds: 1000), () {
        //   _ctx1!.asyncResolveTyped(id, {'result': s});
        // });
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
          'b': [2, 3]
        },
        'list': [
          1,
          {'x': 'y'},
          3.14
        ],
        'str': 'hello',
        'bool': true,
        'null': null
      };

      final result = _ctx1!.evalToString('''
        var data = ${jsonEncode(testData)};
        JSON.stringify(data);
      ''');
      buf.writeln('Eval Map/List Test: $result');

      // 测试 echo 处理器 (Dart -> JS -> Dart -> JS)
      _ctx1!.eval('''
        var echoed = sync_handler('echo', { list: [1, 2, 3], map: { key: "value" } });
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
          dartCallTyped("console_log", JSON.stringify(arr.join(" ")))
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
    final c1 = _ctx1!.eval('dartCallTyped("sum", {a:3,b:4})');
    buf.writeln('eval(dartCall("sum",{3,4})) = $c1');
    _ctx1!.eval(
      'dartCallAsyncTyped("sum", {a:10,b:20}).then(v => console.log(v))',
    );
    _ctx1!.eval(
      'dartCallAsyncDefer("sum", {a:7,b:8}).then(v => console.log(v))',
    );
    buf.writeln('启动延迟异步: then 会在稍后打印');
    _ctx1!.eval(
      'dartCallAsyncDefer("sum_error", {a:1,b:2}).catch(e => console.log("reject", e))',
    );

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
