import 'dart:async';

import 'package:flutter/material.dart';
import 'package:fuickjs_flutter/core/engine/engine.dart';
import 'package:fuickjs_flutter/core/engine/jscontext_delegate.dart';
import 'package:fuickjs_flutter/core/engine/memory_watchdog.dart';
import 'package:fuickjs_flutter/core/engine/worker_recovery.dart';

/// 引擎健壮性测试页（对应 docs/engine-resilience.md）。
///
/// 在 demo 里复现并观察那几类故障场景与 L0~L3 四层防线，外加 P0 的观察：
///
/// 1. **JS 死循环卡死 worker isolate** —— [EngineInit.jsExecutionTimeout]
///    现在**默认 10s 开启**（L0 native interrupt），该次 eval 会在大约 10s 后
///    被中断抛错、isolate 存活；显式设成 null 关掉该防线后，isolate 冻结，
///    由 L1 心跳探活 + L3 自动重启兜底。
/// 2. **JS 侧内存泄漏缓慢增长** —— 反复 eval 追加可达对象，L1 MemoryWatchdog
///    采样 `computeMemoryUsage` 判断持续增长，越过 critical 阈值触发自动重启
///    （走 worker_recovery 的自动路径，消费熔断预算）。
/// 3. **重启风暴 → 熔断器** —— 连续卡死 isolate 迫使自动重启反复发生，滑动窗口
///    内耗尽配额后 [EngineInit.onWorkerPermanentlyFailed] 触发，自动恢复放弃。
/// 4. **P0 dispose 安全** —— 由 [FuickAppView] 的「页面加载失败 + 重试」UI 与
///    dispose 路径保证，本页不直接驱动，但可在卡死时去 bundle 页观察到错误态。
///
/// 注意：本页用的是一个 scratch [JsContextDelegate]，它与所有 bundle 共享同一个
/// worker isolate 与 QuickJS runtime（`IsolateWorker.instance` 单例），因此
/// 卡死 / 泄漏 / 内存快照都与真实 bundle 等价。
class EngineResiliencePage extends StatefulWidget {
  const EngineResiliencePage({super.key});

  @override
  State<EngineResiliencePage> createState() => _EngineResiliencePageState();
}

class _EngineResiliencePageState extends State<EngineResiliencePage> {
  // ── 配置（镜像 EngineInit 静态项，点击「应用并重启」后于下次 spawn 生效）──
  bool _execTimeoutEnabled = false;
  bool _memoryLimitEnabled = false;
  bool _fastHeartbeat = false;

  /// 与框架 `IsolateWorker.jsExecutionTimeout` 的默认值保持一致（10s）。
  /// 开关打开即用这个值，关闭则显式传 null（关掉 L0 防线，死循环重新变成
  /// 「冻结 isolate → 等心跳重启」）。
  static const Duration _execTimeoutBudget = Duration(seconds: 10);

  // ── 本地 MemoryWatchdog（直接把采样接到本页 scratch context）──────────────
  // 选用比生产小得多的阈值，让泄漏在几秒内就能触发一次自动重启，方便演示。
  static const Duration _watchdogSampleInterval = Duration(seconds: 2);
  static const int _watchdogWarnBytes = 4 * 1024 * 1024;
  static const int _watchdogCriticalBytes = 12 * 1024 * 1024;
  static const int _watchdogConsecutiveSamples = 4;
  static const int _watchdogMinGrowthBytes = 2 * 1024 * 1024;

  MemoryWatchdog? _watchdog;
  bool _watchdogEnabled = false;

  // ── 运行态 ─────────────────────────────────────────────────────────────
  JsContextDelegate? _scratch;
  Future<void>? _scratchInitFuture;
  bool _workerReady = false;

  Timer? _leakTimer;
  bool _leaking = false;

  Timer? _memPollTimer;
  int _mallocBytes = 0;
  int _usedBytes = 0;

  Completer<String>? _lifecycleWaiter;
  bool _stormRunning = false;

  final List<_LogEntry> _logs = [];
  static const int _maxLogs = 200;

  // 生命周期监听必须用同一闭包实例 add/remove：匿名新闭包无法被 List.remove 命中
  // （按 == 比较引用），否则页面 dispose 后监听残留，继续回调已销毁的 State。方法
  // tear-off 每次访问都可能生成新闭包，同样破坏 remove 的引用匹配，故保留闭包字段。
  // ignore: prefer_function_declarations_over_variables
  late final void Function() _onRestartingListener =
      () => _onLifecycle('restarting');
  // ignore: prefer_function_declarations_over_variables
  late final void Function() _onRestartedListener =
      () => _onLifecycle('restarted');
  // ignore: prefer_function_declarations_over_variables
  late final void Function() _onPermanentListener =
      () => _onLifecycle('permanent');
  // ignore: prefer_function_declarations_over_variables
  late final void Function(bool graceful) _onShutdownListener = (graceful) {
    _log(
      graceful
          ? 'L2 优雅关停完成：shutdownRuntime → destroyRuntime，旧 JS 堆已释放'
          : 'L2 优雅关停失败/超时：旧 runtime 走强制 dispose（不保证全量释放）',
      graceful ? _Level.success : _Level.warn,
    );
  };

  @override
  void initState() {
    super.initState();
    // 开关初值跟随框架当前默认（jsExecutionTimeout 现已默认 10s 开启）。
    _execTimeoutEnabled = EngineInit.jsExecutionTimeout != null;
    EngineInit.addOnWorkerRestartingListener(_onRestartingListener);
    EngineInit.addOnWorkerRestartedListener(_onRestartedListener);
    EngineInit.addOnWorkerPermanentlyFailedListener(_onPermanentListener);
    EngineInit.addOnWorkerShutdownListener(_onShutdownListener);
    unawaited(_ensureScratch());
    _startMemoryPoll();
  }

  @override
  void dispose() {
    EngineInit.removeOnWorkerRestartingListener(_onRestartingListener);
    EngineInit.removeOnWorkerRestartedListener(_onRestartedListener);
    EngineInit.removeOnWorkerPermanentlyFailedListener(_onPermanentListener);
    EngineInit.removeOnWorkerShutdownListener(_onShutdownListener);
    _watchdog?.stop();
    _leakTimer?.cancel();
    _memPollTimer?.cancel();
    _scratch?.dispose();
    super.dispose();
  }

  // ── 生命周期 ────────────────────────────────────────────────────────────

  void _onLifecycle(String event) {
    if (event == 'restarting') {
      _log('onWorkerRestarting：旧 isolate 即将被丢弃', _Level.warn);
      _stopLeak(silent: true); // 泄漏来源随旧 runtime 一起消失
      if (mounted) setState(() => _workerReady = false);
    } else if (event == 'restarted') {
      _log('onWorkerRestarted：新 isolate 已就绪', _Level.success);
      unawaited(_ensureScratch());
    } else if (event == 'permanent') {
      _log('onWorkerPermanentlyFailed：熔断器耗尽配额，自动恢复放弃', _Level.error);
    }

    // 重启风暴脚本只在「重启完成 / 永久失败」两个收尾信号上放行，不理会 restarting。
    if (event == 'restarted' || event == 'permanent') {
      final waiter = _lifecycleWaiter;
      if (waiter != null && !waiter.isCompleted) {
        _lifecycleWaiter = null;
        waiter.complete(event);
      }
    }
  }

  // ── scratch context ─────────────────────────────────────────────────────

  Future<void> _ensureScratch() {
    if (_scratch != null && _workerReady) return Future<void>.value();
    final running = _scratchInitFuture;
    if (running != null) return running;
    final fut = _doEnsureScratch();
    _scratchInitFuture = fut;
    fut.whenComplete(() {
      if (identical(_scratchInitFuture, fut)) _scratchInitFuture = null;
    });
    return fut;
  }

  Future<void> _doEnsureScratch() async {
    try {
      await EngineInit.preload();
      final old = _scratch;
      final fresh = JsContextDelegate(
        'engine_resilience_${DateTime.now().microsecondsSinceEpoch}',
      );
      await fresh.init();
      _scratch = fresh;
      old?.dispose();
      if (mounted) setState(() => _workerReady = true);
      _log('scratch context 就绪（${fresh.contextId}）', _Level.success);
    } catch (e) {
      // 配置校验失败（旧 native 库缺 L0 符号）会在此处而非 restartWorker() 抛出——
      // createContext 时才真正构造 runtime。只记录不 rethrow，避免 unawaited 调用
      // 产生无意义 unhandled error。
      if (mounted) setState(() => _workerReady = false);
      _log('scratch context 初始化失败: $e', _Level.error);
    }
  }

  // ── 内存轮询 ────────────────────────────────────────────────────────────

  void _startMemoryPoll() {
    _memPollTimer =
        Timer.periodic(const Duration(seconds: 1), (_) => _sampleMemory());
  }

  Future<void> _sampleMemory() async {
    final ctx = _scratch;
    if (ctx == null) return;
    try {
      final usage = await ctx.computeMemoryUsage();
      if (mounted) {
        setState(() {
          _mallocBytes = usage.mallocSize;
          _usedBytes = usage.memoryUsedSize;
        });
      }
    } catch (_) {
      // worker 正在重启/卡死时采样会失败，跳过这一秒。
    }
  }

  // ── 配置应用 ────────────────────────────────────────────────────────────

  void _applyConfig() {
    EngineInit.jsExecutionTimeout =
        _execTimeoutEnabled ? _execTimeoutBudget : null;
    EngineInit.jsMemoryLimitBytes =
        _memoryLimitEnabled ? 64 * 1024 * 1024 : null;
    // 0/负数会关掉自动周期 GC，这里显式保留 QuickJS 默认（256 KiB）。
    EngineInit.jsGcThresholdBytes = null;
    if (_fastHeartbeat) {
      EngineInit.heartbeatInterval = const Duration(seconds: 2);
      EngineInit.heartbeatTimeout = const Duration(seconds: 1);
      EngineInit.heartbeatFailureThreshold = 2;
    } else {
      EngineInit.heartbeatInterval = const Duration(seconds: 10);
      EngineInit.heartbeatTimeout = const Duration(seconds: 5);
      EngineInit.heartbeatFailureThreshold = 3;
    }
  }

  Future<void> _applyConfigAndRestart() async {
    _applyConfig();
    _log('应用配置并重启 worker…', _Level.info);
    try {
      await EngineInit.restartWorker();
      _log('重启完成，新 isolate 已就绪（配置随 spawn 带入）', _Level.success);
    } catch (e) {
      // 只有 respawn 本身失败（如系统资源耗尽）才会走到这里；L0 能力不满足等
      // 配置校验错误是在重启后首次 createContext 时抛（见 scratch 初始化日志）。
      _log('重启失败: $e', _Level.error);
    }
  }

  // ── 场景 1：JS 死循环 ───────────────────────────────────────────────────

  void _freezeWorkerFireAndForget() {
    final ctx = _scratch;
    if (ctx == null) {
      _log('当前无可用 scratch context', _Level.error);
      return;
    }
    final sw = Stopwatch()..start();
    _log('触发 JS 死循环 while(true){}（L0 生效时约 5s 后打断；'
        '否则阻塞直到心跳/手动重启兜底）', _Level.warn);
    ctx.eval('while (true) {}').then((_) {
      _log('死循环 eval 意外返回（${sw.elapsedMilliseconds}ms）', _Level.error);
    }).catchError((Object e) {
      if (e is StateError) {
        // worker 正在重启：_performRestart 会把所有在途请求以 StateError 就地
        // 失败（重启风暴里几乎必经这条路径），循环没跑几毫秒就被重启中止了。
        _log('eval 被 worker 重启中止（${sw.elapsedMilliseconds}ms）：$e',
            _Level.muted);
      } else if (EngineInit.jsExecutionTimeout != null) {
        // L0 生效：native interrupt handler 打断这次同步执行、让本次调用抛错，
        // isolate 未被卡死也无需重启（status 卡内存继续每秒刷新）。
        _log('eval 被 native interrupt 打断（${sw.elapsedMilliseconds}ms）：$e',
            _Level.success);
      } else {
        // 未开 L0 无法中断死循环：这里的错误只是这条 RPC 超时被放弃，
        // worker 依然冻着，真正的恢复靠心跳 → L3 自动重启（约 30~40s 后）。
        _log('eval RPC 超时（${sw.elapsedMilliseconds}ms）——worker 已冻结且'
            '这条调用被放弃，等待心跳/L3 自动重启：$e', _Level.warn);
      }
      return null;
    });
  }

  // ── 场景 2：内存泄漏 ────────────────────────────────────────────────────

  void _startLeak() {
    if (_leaking) return;
    _leaking = true;
    if (mounted) setState(() {});
    _log('开始持续分配内存（每 500ms 追加 ~1MB 可达对象到 globalThis）',
        _Level.warn);
    _leakTimer = Timer.periodic(const Duration(milliseconds: 500), (_) async {
      final ctx = _scratch;
      if (ctx == null) return;
      try {
        // 每次都生成一个 1MB 的新字符串并 push 进一个永不清空的数组，
        // 制造「长期持有可达对象」导致的持续增长。
        await ctx.eval(
          "globalThis.__leak = globalThis.__leak || [];"
          "globalThis.__leak.push('x'.repeat(1024 * 1024));",
        );
      } catch (e) {
        _log('内存分配失败（可能触及 jsMemoryLimitBytes 上限）：$e',
            _Level.error);
        _stopLeak(silent: true);
      }
    });
  }

  void _stopLeak({bool silent = false}) {
    if (!_leaking) return;
    _leaking = false;
    _leakTimer?.cancel();
    _leakTimer = null;
    if (mounted) setState(() {});
    if (!silent) _log('停止内存分配', _Level.info);
  }

  // ── 场景 3：重启风暴 → 熔断器 ───────────────────────────────────────────

  Future<void> _runRestartStorm() async {
    if (_stormRunning) return;
    setState(() => _stormRunning = true);
    final maxPerWindow = EngineInit.maxRestartsPerWindow;
    _log('开始重启风暴模拟：window ${EngineInit.restartWindow.inMinutes} 分钟 / '
        '$maxPerWindow 次自动重启，超限即熔断', _Level.warn);
    try {
      for (int i = 1; i <= maxPerWindow + 1; i++) {
        if (!mounted) return;
        _log('— 第 $i 次：卡死 worker 并走自动重启入口 —', _Level.info);
        await _ensureScratch();
        _freezeWorkerFireAndForget();
        // 心跳 / MemoryWatchdog 最终都汇到这个自动重启入口，消费同一份 RestartBudget。
        // 注意：requestAutomaticWorkerRestart 内部 await restart() 会同步等到
        // onWorkerRestarted/onWorkerPermanentlyFailed 广播完（_onLifecycle 里会
        // 顺手把 _lifecycleWaiter 置回 null），所以这里必须用局部引用等这个
        // Completer，不能用可能已为 null 的字段，否则必然空指针。
        final waiter = Completer<String>();
        _lifecycleWaiter = waiter;
        await requestAutomaticWorkerRestart('demo restart storm');
        final event = await waiter.future.timeout(
          const Duration(seconds: 30),
          onTimeout: () => 'timeout',
        );
        _log('本轮自动恢复结果: $event', _Level.info);
        if (event == 'permanent') {
          _log('熔断器熔断：$maxPerWindow 次/窗口 配额耗尽，自动恢复放弃，'
              '后续只能 [手动重启 worker] 恢复', _Level.error);
          return;
        }
        if (event == 'timeout') {
          _log('等待超时，风暴模拟中止', _Level.error);
          return;
        }
      }
      _log('风暴模拟结束：$maxPerWindow 次内未触发熔断', _Level.info);
    } finally {
      _lifecycleWaiter = null;
      if (mounted) setState(() => _stormRunning = false);
    }
  }

  // ── MemoryWatchdog 开关 ─────────────────────────────────────────────────

  void _toggleWatchdog(bool on) {
    setState(() => _watchdogEnabled = on);
    if (!on) {
      _watchdog?.stop();
      _watchdog = null;
      _log('关闭内存增长监控（本地 MemoryWatchdog）', _Level.info);
      return;
    }
    final watchdog = MemoryWatchdog(
      sampleInterval: _watchdogSampleInterval,
      warnThresholdBytes: _watchdogWarnBytes,
      criticalThresholdBytes: _watchdogCriticalBytes,
      consecutiveGrowthSamplesForLeak: _watchdogConsecutiveSamples,
      minimumGrowthBytes: _watchdogMinGrowthBytes,
    );
    watchdog.onLeakDetected = (report) {
      _log('MemoryWatchdog 判定内存泄漏：$report', _Level.error);
      // 与框架 FuickAppContextManager 相同的接线：走自动路径，消费熔断预算。
      unawaited(requestAutomaticWorkerRestart('demo MemoryWatchdog'));
    };
    _watchdog = watchdog;
    // 采样器直接内联：闭包在 start 的实参上下文里推断出 Future<JSMemoryUsage>，
    // 无需在 demo 里直接 import fjs_engine 命名该类型（那是传递依赖）。
    watchdog.start(() async {
      final ctx = _scratch;
      if (ctx == null) {
        throw StateError('no scratch context');
      }
      return ctx.computeMemoryUsage();
    });
    _log('开启内存增长监控（sampleInterval=${_watchdogSampleInterval.inSeconds}s, '
        'warn=${_fmt(_watchdogWarnBytes)}, '
        'critical=${_fmt(_watchdogCriticalBytes)}）', _Level.info);
  }

  // ── 手动操作 ────────────────────────────────────────────────────────────

  Future<void> _manualRestart() async {
    _log('手动重启 worker（EngineInit.restartWorker，重置熔断预算）…',
        _Level.warn);
    try {
      await EngineInit.restartWorker();
      _log('手动重启完成', _Level.success);
    } catch (e) {
      _log('手动重启失败: $e', _Level.error);
    }
  }

  Future<void> _forceGc() async {
    final ctx = _scratch;
    if (ctx == null) return;
    try {
      await ctx.runGC();
      _log('强制完整 GC 完成', _Level.info);
      await _sampleMemory();
    } catch (e) {
      _log('GC 失败: $e', _Level.error);
    }
  }

  // ── 日志 ────────────────────────────────────────────────────────────────

  void _log(String message, _Level level) {
    if (!mounted) return;
    setState(() {
      _logs.insert(0, _LogEntry(message, level));
      if (_logs.length > _maxLogs) {
        _logs.removeRange(_maxLogs, _logs.length);
      }
    });
  }

  // ── 构建 ────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('引擎健壮性测试')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildStatusCard(),
          const SizedBox(height: 12),
          _buildConfigCard(),
          const SizedBox(height: 12),
          _buildScenarioCard(),
          const SizedBox(height: 12),
          _buildLogCard(),
        ],
      ),
    );
  }

  Widget _buildStatusCard() {
    return _Card(
      title: '引擎状态',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _kv('worker 状态', _workerReady ? 'scratch context 就绪' : '未就绪'),
          const SizedBox(height: 6),
          _kv('JS 堆 malloc', _fmt(_mallocBytes)),
          _kv('JS 堆 used', _fmt(_usedBytes)),
          _kv(
            'jsExecutionTimeout',
            EngineInit.jsExecutionTimeout == null
                ? '未设置（死循环依赖心跳/手动重启兜底）'
                : '${EngineInit.jsExecutionTimeout!.inSeconds}s',
          ),
          _kv(
            '心跳',
            'interval=${EngineInit.heartbeatInterval?.inSeconds ?? "-"}s / '
            'timeout=${EngineInit.heartbeatTimeout.inSeconds}s / '
            '阈值=${EngineInit.heartbeatFailureThreshold}',
          ),
          _kv(
            '熔断器',
            '${EngineInit.maxRestartsPerWindow} 次 / '
            '${EngineInit.restartWindow.inMinutes} 分钟（需 App 冷启动生效）',
          ),
        ],
      ),
    );
  }

  Widget _buildConfigCard() {
    return _Card(
      title: '防御配置（点击「应用并重启」后生效）',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SwitchListTile(
            contentPadding: EdgeInsets.zero,
            dense: true,
            title: const Text('L0 · jsExecutionTimeout（10s 执行预算，框架默认开启）'),
            subtitle: const Text('死循环将被 native interrupt 打断，而不是卡死 isolate；'
                '关闭则显式传 null，死循环重新变成冻结 isolate'),
            value: _execTimeoutEnabled,
            onChanged: (v) => setState(() => _execTimeoutEnabled = v),
          ),
          SwitchListTile(
            contentPadding: EdgeInsets.zero,
            dense: true,
            title: const Text('L0 · jsMemoryLimitBytes（64MB 内存上限）'),
            subtitle: const Text('超过上限分配失败体现为 JS OOM'),
            value: _memoryLimitEnabled,
            onChanged: (v) => setState(() => _memoryLimitEnabled = v),
          ),
          SwitchListTile(
            contentPadding: EdgeInsets.zero,
            dense: true,
            title: const Text('L1 · 快速心跳（2s 间隔，更快探活）'),
            subtitle: const Text('默认 10s；快速模式数秒内即可判定卡死'),
            value: _fastHeartbeat,
            onChanged: (v) => setState(() => _fastHeartbeat = v),
          ),
          SwitchListTile(
            contentPadding: EdgeInsets.zero,
            dense: true,
            title: const Text('L1 · MemoryWatchdog（内存增长监控）'),
            subtitle: Text(
                '阈值 lower：critical ${_fmt(_watchdogCriticalBytes)}，触发自动重启'),
            value: _watchdogEnabled,
            onChanged: _toggleWatchdog,
          ),
          const SizedBox(height: 8),
          SizedBox(
            width: double.infinity,
            child: FilledButton.icon(
              icon: const Icon(Icons.restart_alt),
              label: const Text('应用配置并重启 worker'),
              onPressed: _applyConfigAndRestart,
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            '提示：jsGcThresholdBytes 传 null 保留默认（256 KiB，自动周期 GC）；'
            '传 0 会关闭周期 GC 反而放大泄漏。',
            style: TextStyle(fontSize: 12, color: Colors.grey),
          ),
        ],
      ),
    );
  }

  Widget _buildScenarioCard() {
    return _Card(
      title: '故障场景模拟',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          _scenarioButton(
            icon: Icons.hourglass_empty,
            label: 'JS 死循环卡死 worker',
            hint: '默认开启（10s）→ L0 打断；关掉后 → 冻结，等待心跳自动重启',
            onTap: _freezeWorkerFireAndForget,
          ),
          _scenarioButton(
            icon: _leaking ? Icons.stop_circle : Icons.play_circle,
            label: _leaking ? '停止内存泄漏' : '开始内存泄漏（持续分配）',
            hint: '配合 MemoryWatchdog 观察 L1 检测 + L3 自动重启',
            color: _leaking ? Colors.red : null,
            onTap: _leaking ? () => _stopLeak() : _startLeak,
          ),
          _scenarioButton(
            icon: Icons.storm,
            label: '重启风暴（连续卡死直到熔断）',
            hint: '逐次卡死 worker，观察 L3 熔断器耗尽配额后 permanent failure',
            onTap: _stormRunning ? null : () => unawaited(_runRestartStorm()),
          ),
          _scenarioButton(
            icon: Icons.settings_backup_restore,
            label: '手动重启 worker',
            hint: 'EngineInit.restartWorker()，不走熔断器并重置预算',
            onTap: () => unawaited(_manualRestart()),
          ),
          _scenarioButton(
            icon: Icons.cleaning_services,
            label: '手动强制执行 GC',
            hint: '观察 GC 只回收不可达对象，无法回收已泄漏的可达对象',
            onTap: () => unawaited(_forceGc()),
          ),
        ],
      ),
    );
  }

  Widget _scenarioButton({
    required IconData icon,
    required String label,
    required String hint,
    required VoidCallback? onTap,
    Color? color,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          OutlinedButton.icon(
            icon: Icon(icon, size: 20),
            label: SizedBox(width: double.infinity, child: Text(label)),
            onPressed: onTap,
            style: OutlinedButton.styleFrom(
              foregroundColor: color,
              alignment: Alignment.centerLeft,
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(top: 2, left: 4),
            child: Text(
              hint,
              style: const TextStyle(fontSize: 12, color: Colors.grey),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLogCard() {
    return _Card(
      title: '事件日志',
      trailing: TextButton(
        onPressed: _logs.isEmpty ? null : () => setState(() => _logs.clear()),
        child: const Text('清空'),
      ),
      child: Container(
        height: 360,
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: const Color(0xFF1E1E1E),
          borderRadius: BorderRadius.circular(8),
        ),
        child: _logs.isEmpty
            ? const Center(
                child: Text(
                  '暂无事件，点击上方按钮开始模拟',
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
      ),
    );
  }

  Widget _kv(String k, String v) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 120,
          child: Text(
            k,
            style: const TextStyle(color: Colors.grey, fontSize: 13),
          ),
        ),
        Expanded(
          child: Text(
            v,
            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500),
          ),
        ),
      ],
    );
  }
}

// ── 通用小组件 ────────────────────────────────────────────────────────────

class _Card extends StatelessWidget {
  final String title;
  final Widget child;
  final Widget? trailing;

  const _Card({required this.title, required this.child, this.trailing});

  @override
  Widget build(BuildContext context) {
    // 用 Material 承载卡片背景，而不是 Container + BoxDecoration：
    // 后者是「有背景色的 DecoratedBox」，会挡住里面 SwitchListTile（其内部
    // ListTile）的 ink 高亮，Flutter 在 debug 下会抛
    // "ListTile background color or ink splashes may be invisible"。
    return Material(
      color: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: const BorderSide(color: Color(0xFFE0E0E0)),
      ),
      clipBehavior: Clip.antiAlias,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  title,
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                if (trailing != null) trailing!,
              ],
            ),
            const SizedBox(height: 12),
            child,
          ],
        ),
      ),
    );
  }
}

enum _Level { info, success, warn, error, muted }

extension _LevelColor on _Level {
  Color get color => switch (this) {
        _Level.info => const Color(0xFFB0BEC5),
        _Level.success => const Color(0xFF66BB6A),
        _Level.warn => const Color(0xFFFFA726),
        _Level.error => const Color(0xFFEF5350),
        _Level.muted => const Color(0xFF90A4AE),
      };
}

class _LogEntry {
  final String message;
  final _Level level;
  final String time;

  _LogEntry(this.message, this.level)
      : time = _formatTime(DateTime.now());
}

String _formatTime(DateTime t) {
  String p(int n) => n.toString().padLeft(2, '0');
  return '${p(t.hour)}:${p(t.minute)}:${p(t.second)}.${(t.millisecond / 100).round()}';
}

String _fmt(int bytes) {
  if (bytes < 1024) return '$bytes B';
  if (bytes < 1024 * 1024) return '${(bytes / 1024).toStringAsFixed(1)} KB';
  return '${(bytes / 1024 / 1024).toStringAsFixed(2)} MB';
}