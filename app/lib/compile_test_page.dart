import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:fuickjs_flutter/core/engine/engine.dart';
import 'package:fuickjs_flutter/core/engine/jscontext_delegate.dart';

/// 字节码编译流程测试页。
///
/// 演示引擎新增的本地编译能力：JS 源码 → compile() → 字节码(Uint8List) →
/// evalBinary() 执行，并与直接 eval 源码的结果做对比。
class CompileTestPage extends StatefulWidget {
  const CompileTestPage({super.key});

  @override
  State<CompileTestPage> createState() => _CompileTestPageState();
}

class _CompileTestPageState extends State<CompileTestPage> {
  final TextEditingController _codeController = TextEditingController(
    text: 'const a = 40;\nconst b = 2;\na + b;',
  );

  JsContextDelegate? _ctx;
  bool _ctxReady = false;
  bool _isModule = false;
  bool _stripSource = true;
  bool _running = false;

  final List<_LogEntry> _logs = [];

  @override
  void initState() {
    super.initState();
    _initContext();
  }

  Future<void> _initContext() async {
    try {
      await EngineInit.preload();
      final ctx = JsContextDelegate(
        'compile_test_${DateTime.now().microsecondsSinceEpoch}',
      );
      await ctx.init();
      if (!mounted) {
        ctx.dispose();
        return;
      }
      setState(() {
        _ctx = ctx;
        _ctxReady = true;
      });
      _log('引擎上下文已就绪', _LogLevel.info);
    } catch (e) {
      _log('上下文初始化失败: $e', _LogLevel.error);
    }
  }

  @override
  void dispose() {
    _ctx?.dispose();
    _codeController.dispose();
    super.dispose();
  }

  void _log(String message, _LogLevel level) {
    if (!mounted) return;
    setState(() {
      _logs.insert(0, _LogEntry(message, level));
    });
  }

  String _hexPreview(Uint8List bytes, {int max = 32}) {
    final count = bytes.length < max ? bytes.length : max;
    final hex = List.generate(
      count,
      (i) => bytes[i].toRadixString(16).padLeft(2, '0'),
    ).join(' ');
    return bytes.length > max ? '$hex …' : hex;
  }

  /// 创建一个用完即弃的临时上下文。
  ///
  /// 编译与执行各用独立上下文，避免顶层 `const`/`let` 在同一全局词法环境中
  /// 重复声明（同一 context 内重复执行同一份源码会触发
  /// `SyntaxError: redeclaration of ...`）。
  Future<JsContextDelegate> _newScratchContext() async {
    final ctx = JsContextDelegate(
      'compile_test_run_${DateTime.now().microsecondsSinceEpoch}',
    );
    await ctx.init();
    return ctx;
  }

  Future<void> _runCompileFlow() async {
    if (!_ctxReady || _running) return;

    final code = _codeController.text;
    setState(() => _running = true);
    _log('================ 开始编译流程 ================', _LogLevel.info);

    // 字节码路径与源码路径各用独立的临时上下文，互不污染全局环境。
    JsContextDelegate? bytecodeCtx;
    JsContextDelegate? sourceCtx;
    try {
      bytecodeCtx = await _newScratchContext();
      final sw = Stopwatch()..start();

      // 1. 源码本地编译为字节码
      final Uint8List bytecode = await bytecodeCtx.compile(
        code,
        isModule: _isModule,
        stripSource: _stripSource,
      );
      final compileMs = sw.elapsedMilliseconds;
      _log(
        '① 编译成功：字节码 ${bytecode.length} 字节（耗时 ${compileMs}ms）',
        _LogLevel.success,
      );
      _log('   预览: ${_hexPreview(bytecode)}', _LogLevel.info);

      // 2. 执行字节码
      sw.reset();
      final bytecodeResult =
          await bytecodeCtx.evalBinary(bytecode, returnValue: true);
      _log(
        '② 执行字节码结果: $bytecodeResult（耗时 ${sw.elapsedMilliseconds}ms）',
        _LogLevel.success,
      );

      // 3. 直接 eval 源码做对比（module 模式不返回值，跳过）
      if (!_isModule) {
        sourceCtx = await _newScratchContext();
        sw.reset();
        final sourceResult = await sourceCtx.eval(code, returnValue: true);
        _log(
          '③ 直接 eval 源码结果: $sourceResult（耗时 ${sw.elapsedMilliseconds}ms）',
          _LogLevel.info,
        );
        final match = '$bytecodeResult' == '$sourceResult';
        _log(
          match ? '✓ 字节码与源码执行结果一致' : '✗ 结果不一致，请检查',
          match ? _LogLevel.success : _LogLevel.error,
        );
      }
    } catch (e) {
      _log('编译流程失败: $e', _LogLevel.error);
    } finally {
      bytecodeCtx?.dispose();
      sourceCtx?.dispose();
      if (mounted) setState(() => _running = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('字节码编译测试')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'JS 源码',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _codeController,
              minLines: 4,
              maxLines: 8,
              style: const TextStyle(
                fontFamily: 'monospace',
                fontSize: 13,
              ),
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                isDense: true,
              ),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: SwitchListTile(
                    contentPadding: EdgeInsets.zero,
                    dense: true,
                    title: const Text('ES Module'),
                    value: _isModule,
                    onChanged: (v) => setState(() => _isModule = v),
                  ),
                ),
                Expanded(
                  child: SwitchListTile(
                    contentPadding: EdgeInsets.zero,
                    dense: true,
                    title: const Text('strip 源码'),
                    value: _stripSource,
                    onChanged: (v) => setState(() => _stripSource = v),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 4),
            ElevatedButton.icon(
              onPressed: (_ctxReady && !_running) ? _runCompileFlow : null,
              icon: _running
                  ? const SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Icon(Icons.memory),
              label: Text(
                _ctxReady ? '编译 → 字节码 → 执行' : '引擎初始化中…',
              ),
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  '执行日志',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                TextButton(
                  onPressed: _logs.isEmpty
                      ? null
                      : () => setState(() => _logs.clear()),
                  child: const Text('清空'),
                ),
              ],
            ),
            const Divider(height: 1),
            Expanded(
              child: ListView.builder(
                itemCount: _logs.length,
                itemBuilder: (context, index) {
                  final entry = _logs[index];
                  return Padding(
                    padding: const EdgeInsets.symmetric(vertical: 4),
                    child: Text(
                      entry.message,
                      style: TextStyle(
                        color: entry.color,
                        fontFamily: 'monospace',
                        fontSize: 12.5,
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

enum _LogLevel { info, success, error }

class _LogEntry {
  final String message;
  final _LogLevel level;

  _LogEntry(this.message, this.level);

  Color get color {
    switch (level) {
      case _LogLevel.success:
        return const Color(0xFF2E7D32);
      case _LogLevel.error:
        return const Color(0xFFC62828);
      case _LogLevel.info:
        return const Color(0xFF37474F);
    }
  }
}
