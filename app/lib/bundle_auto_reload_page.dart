import 'dart:async';

import 'package:flutter/material.dart';
import 'package:fuickjs_flutter/core/engine/engine.dart';

import 'fuick_app_page.dart';

/// bundle「已打开页面自动重载」测试页。
///
/// 场景：worker isolate 重启后，**已经打开**的这个 bundle 页不会就此死掉——
/// 它收到 `onWorkerRestarting` 先退成 loading，`onWorkerRestarted` 后再自动
/// 重新 init 一次（重新 createContext + 重新 eval bundle），等于当场触发一次
/// 新的 bundle 启动。对用户来说效果是「闪一下 loading → 自己重载回初始路由」。
///
/// 本页把真实 [FuickAppView] 内嵌在页面上方渲染 bundle，下方放「触发重启」按钮
/// 和生命周期日志；点按钮后所有订阅方（包括这个已打开的 bundle 页）都会同步收到
/// lifecycle 广播，可直接观察上方 bundle 的 loading 闪烁与自动重载。
///
/// 用「手动重启」是为了确定性；心跳/内存 watchdog 触发的自动重启走的是同一个
/// `restart()`，广播序列一模一样，效果相同。
class BundleAutoReloadPage extends StatefulWidget {
  final String appName;
  final String path;

  const BundleAutoReloadPage({
    super.key,
    this.appName = 'bundle',
    this.path = '/',
  });

  @override
  State<BundleAutoReloadPage> createState() => _BundleAutoReloadPageState();
}

class _BundleAutoReloadPageState extends State<BundleAutoReloadPage> {
  bool _restarting = false;

  final List<_LogEntry> _logs = [];
  static const int _maxLogs = 100;

  // 闭包字段保持 add/remove 同一引用（方法 tear-off 每次访问生成新闭包，
  // remove 会因引用不同而命不中，导致页面 dispose 后监听残留）。
  // ignore: prefer_function_declarations_over_variables
  late final void Function() _onRestarting = () =>
      _log('onWorkerRestarting：本 bundle 页退回 loading', _Level.warn);
  // ignore: prefer_function_declarations_over_variables
  late final void Function() _onRestarted = () => _log(
      'onWorkerRestarted：本 bundle 页自动重新 init（重建 context + 重新 eval bundle）',
      _Level.success);
  // ignore: prefer_function_declarations_over_variables
  late final void Function() _onPermanent = () =>
      _log('onWorkerPermanentlyFailed：熔断器耗尽，自动恢复放弃', _Level.error);
  // ignore: prefer_function_declarations_over_variables
  late final void Function(bool graceful) _onShutdown = (graceful) => _log(
        graceful ? 'L2 优雅关停：destroyRuntime 已释放旧堆' : 'L2 关停失败/超时：走强制 dispose',
        graceful ? _Level.success : _Level.warn,
      );

  @override
  void initState() {
    super.initState();
    EngineInit.addOnWorkerRestartingListener(_onRestarting);
    EngineInit.addOnWorkerRestartedListener(_onRestarted);
    EngineInit.addOnWorkerPermanentlyFailedListener(_onPermanent);
    EngineInit.addOnWorkerShutdownListener(_onShutdown);
  }

  @override
  void dispose() {
    EngineInit.removeOnWorkerRestartingListener(_onRestarting);
    EngineInit.removeOnWorkerRestartedListener(_onRestarted);
    EngineInit.removeOnWorkerPermanentlyFailedListener(_onPermanent);
    EngineInit.removeOnWorkerShutdownListener(_onShutdown);
    super.dispose();
  }

  Future<void> _triggerRestart() async {
    _log('触发 EngineInit.restartWorker()…', _Level.info);
    setState(() => _restarting = true);
    try {
      await EngineInit.restartWorker();
      _log('restartWorker() 返回（广播在 await 内同步发出）', _Level.info);
    } catch (e) {
      _log('重启失败: $e', _Level.error);
    } finally {
      if (mounted) setState(() => _restarting = false);
    }
  }

  void _log(String message, _Level level) {
    if (!mounted) return;
    setState(() {
      _logs.insert(0, _LogEntry(message, level));
      if (_logs.length > _maxLogs) {
        _logs.removeRange(_maxLogs, _logs.length);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('bundle 自动重载测试')),
      body: Column(
        children: [
          // 上方：真实 bundle 页本体，占主体高度。
          Expanded(
            flex: 3,
            child: FuickAppPage(
              appName: widget.appName,
              path: widget.path,
              params: const {},
            ),
          ),
          const Divider(height: 1),
          // 下方：触发按钮 + 生命周期日志。
          Expanded(
            flex: 2,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: Row(
                    children: [
                      FilledButton.icon(
                        onPressed: _restarting ? null : _triggerRestart,
                        icon: const Icon(Icons.restart_alt),
                        label: const Text('触发 worker 重启'),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          '点按钮后盯住上方 bundle：「闪一下 loading → 自动重载回初始路由」。'
                          '若停在 loading / 报错，说明恢复链有问题。',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey.shade700,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                Expanded(child: _buildLog()),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLog() {
    return Container(
      color: const Color(0xFF1E1E1E),
      padding: const EdgeInsets.all(10),
      child: _logs.isEmpty
          ? const Center(
              child: Text(
                '点「触发 worker 重启」开始观察',
                style: TextStyle(color: Colors.white38, fontSize: 13),
              ),
            )
          : ListView.builder(
              itemCount: _logs.length,
              itemBuilder: (context, index) {
                final entry = _logs[index];
                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 2),
                  child: Text(
                    '${entry.time}  ${entry.message}',
                    style: TextStyle(
                      color: entry.level.color,
                      fontSize: 12.5,
                      fontFamily: 'monospace',
                      height: 1.4,
                    ),
                  ),
                );
              },
            ),
    );
  }
}

enum _Level { info, success, warn, error }

extension _LevelColor on _Level {
  Color get color => switch (this) {
        _Level.info => const Color(0xFFB0BEC5),
        _Level.success => const Color(0xFF66BB6A),
        _Level.warn => const Color(0xFFFFA726),
        _Level.error => const Color(0xFFEF5350),
      };
}

class _LogEntry {
  _LogEntry(this.message, this.level) : time = _formatTime(DateTime.now());

  final String message;
  final _Level level;
  final String time;
}

String _formatTime(DateTime t) {
  String p(int n) => n.toString().padLeft(2, '0');
  return '${p(t.hour)}:${p(t.minute)}:${p(t.second)}.'
      '${(t.millisecond / 100).round()}';
}