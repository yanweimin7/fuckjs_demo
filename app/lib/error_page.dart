import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:fuickjs_flutter/core/engine/worker_recovery.dart'
    show isWorkerPermanentlyFailed;

/// demo 定制的 [FuickAppView] 错误态，由 `FuickConfig.errorBuilder` 挂上
/// （见 `main_native.dart` / `main_web.dart`）。
///
/// 框架内置的占位态是「灰图标 + 页面加载失败 + 一个按钮」—— 够用，但它是给
/// 所有宿主兜底的，不能假设任何品牌色。宿主自己的错误页该长得像自己的 App：
/// 这里用的就是 demo 首页那套（`#F5F6FA` 底、`#5C6BC0` 主色、16px 圆角卡片）。
///
/// **两种失败要分开说**，因为用户的下一步动作完全不同：
///
/// - **引擎熔断**（[isWorkerPermanentlyFailed]）：worker isolate 连续重启失败，
///   框架已经放弃自动恢复。这时「重试」走的不是重新 init，而是**手动重启 worker**
///   （`FuickAppView._retryInitialization` 内部分流，不受自动恢复的熔断预算限制），
///   所以文案要说「重启引擎」而不是「重新加载」。
/// - **普通 init 失败**：多为资源没就绪 / 网络抖动，重试基本就好了。
///
/// 判断读的是 `isWorkerPermanentlyFailed` 这个**持久位**，不是错误对象本身 ——
/// 两种失败抛的都是同一句 `StateError('JS engine worker recovery failed')`，
/// 靠匹配错误文本区分会在下一版文案调整时静默失效。这个访问器经条件导出做了
/// Web 空实现（Web 无 isolate worker，恒为 false），所以本文件两个平台通用。
///
/// **页面上不展示错误详情 / 堆栈。** 用户看到堆栈既看不懂也做不了什么，只会觉得
/// 应用坏了；`error` 只用于「复制错误信息」这一个出口，方便用户把现场交给排查的人。
/// 需要现场看日志的场景有 `/engine_resilience` 与 debug 模式下的红屏，不该让
/// 普通用户承担调试信息的噪声。
class FuickErrorPage extends StatefulWidget {
  const FuickErrorPage({
    super.key,
    required this.error,
    required this.onRetry,
  });

  /// 失败原因，直接来自 `FuickErrorBuilder` 的第二个参数。
  ///
  /// **不渲染到界面上**，只作为「复制错误信息」的内容（见类文档）。
  final Object error;

  /// `FuickErrorBuilder` 的第三个参数 —— **已接好恢复逻辑**（普通失败重新 init，
  /// 熔断态手动重启 worker），这里绑到按钮上即可，不需要自己 try/catch。
  final VoidCallback onRetry;

  @override
  State<FuickErrorPage> createState() => _FuickErrorPageState();
}

class _FuickErrorPageState extends State<FuickErrorPage> {
  bool _copied = false;
  Timer? _copiedTimer;

  @override
  void dispose() {
    _copiedTimer?.cancel();
    super.dispose();
  }

  String get _errorText => widget.error.toString();

  void _copy() {
    Clipboard.setData(ClipboardData(text: _errorText));
    setState(() => _copied = true);
    // 用按钮自身的文案反馈，不用 SnackBar：错误态可能出现在没有 Scaffold 的
    // 路由里（demo 的 FuickAppPage 就是这样），那时 ScaffoldMessenger 找不到宿主。
    _copiedTimer?.cancel();
    _copiedTimer = Timer(const Duration(milliseconds: 1600), () {
      if (mounted) setState(() => _copied = false);
    });
  }

  @override
  Widget build(BuildContext context) {
    final crashed = isWorkerPermanentlyFailed;
    final accent = crashed ? const Color(0xFFF57C00) : const Color(0xFFE53935);
    final tint = crashed ? const Color(0xFFFFF3E0) : const Color(0xFFFFEBEE);

    return ColoredBox(
      // 全屏底色：错误态替换的是整个 FuickAppView，而它常常是路由里唯一的内容。
      color: const Color(0xFFF5F6FA),
      child: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 24),
            // 限宽：web / 平板下不至于把一行文案拉成一整屏。
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 380),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  _buildBadge(accent: accent, tint: tint, crashed: crashed),
                  const SizedBox(height: 22),
                  Text(
                    crashed ? '引擎已停止自动恢复' : '页面加载失败',
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF1A1A2E),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    crashed
                        ? 'JS 引擎连续重启失败，框架已停止自动恢复。手动重启一次引擎即可继续使用。'
                        : '加载这个页面时出了点问题，可能是网络波动或资源包尚未就绪。重试一下通常就好了。',
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 13.5,
                      height: 1.6,
                      color: Color(0xFF6B7280),
                    ),
                  ),
                  const SizedBox(height: 32),
                  SizedBox(
                    width: double.infinity,
                    height: 46,
                    child: FilledButton.icon(
                      onPressed: widget.onRetry,
                      style: FilledButton.styleFrom(
                        backgroundColor: const Color(0xFF5C6BC0),
                        foregroundColor: Colors.white,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        textStyle: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      icon: Icon(
                        crashed
                            ? Icons.restart_alt_rounded
                            : Icons.refresh_rounded,
                        size: 19,
                      ),
                      label: Text(crashed ? '重启引擎' : '重新加载'),
                    ),
                  ),
                  const SizedBox(height: 4),
                  TextButton.icon(
                    onPressed: _copy,
                    style: TextButton.styleFrom(
                      foregroundColor: const Color(0xFF9AA1B1),
                      textStyle: const TextStyle(fontSize: 12.5),
                    ),
                    icon: Icon(
                      _copied ? Icons.check_rounded : Icons.copy_rounded,
                      size: 15,
                    ),
                    label: Text(_copied ? '已复制' : '复制错误信息'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildBadge({
    required Color accent,
    required Color tint,
    required bool crashed,
  }) {
    return Container(
      width: 84,
      height: 84,
      decoration: BoxDecoration(
        color: tint,
        shape: BoxShape.circle,
        // 用主色投一层很淡的影，图标就不像贴上去的。
        boxShadow: [
          BoxShadow(
            color: accent.withValues(alpha: 0.18),
            blurRadius: 24,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Icon(
        crashed ? Icons.heart_broken_rounded : Icons.cloud_off_rounded,
        size: 38,
        color: accent,
      ),
    );
  }
}
