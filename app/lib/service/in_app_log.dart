import 'dart:collection';

import 'package:flutter/foundation.dart';
import 'package:logger/logger.dart';

/// 一条被收进 app 内的日志。
class InAppLogRecord {
  final DateTime time;
  final Level level;
  final String message;
  final String? error;

  InAppLogRecord({
    required this.time,
    required this.level,
    required this.message,
    this.error,
  });

  /// 单行文本（用于列表显示与复制导出）。
  String format() {
    final t = time.toIso8601String().substring(11, 23);
    final head = '$t ${level.name.toUpperCase().padRight(7)} $message';
    return error == null ? head : '$head\n    ↳ $error';
  }

  /// 纯文本，便于粘到 issue / 聊天里。
  String toText() => format();
}

/// App 内日志缓冲：把 `package:logger` 的全局日志流留在设备里，
/// 不依赖 `flutter run` 的 console（后台几小时后回来，console 早就被冲掉了，
/// 而且系统日志可能被裁剪）。
///
/// - 只收**主 isolate** 的日志：worker isolate 里那套 logger 是独立静态状态，
///   收不到（worker 侧日志经 ConsoleService 回传到主 isolate 的部分是能收到的）。
/// - 环形缓冲，默认 [_capacity] 条，满了丢最旧的，内存占用有界。
/// - 装一次即可（[install]），在 `runApp` 之前调用，越早越好。
class InAppLog {
  InAppLog._();

  static final InAppLog instance = InAppLog._();

  static const int _capacity = 800;

  final Queue<InAppLogRecord> _records = Queue<InAppLogRecord>();
  final ValueNotifier<int> _revision = ValueNotifier<int>(0);

  /// 记录条数变化通知（UI 用它触发刷新）。
  ValueNotifier<int> get revision => _revision;

  /// 只读快照。
  List<InAppLogRecord> get records => List<InAppLogRecord>.unmodifiable(_records);

  int get length => _records.length;

  /// 丢弃超过 [level] 的记录。
  List<InAppLogRecord> recordsAtLeast(Level level) =>
      _records.where((r) => r.level >= level).toList(growable: false);

  static void install() => instance._install();

  void _install() {
    Logger.addLogListener(_onLog);
  }

  void _onLog(LogEvent event) {
    // 记录日志本身不能因为格式化失败而炸掉，否则会把日志链路变成故障源。
    try {
      _records.addLast(
        InAppLogRecord(
          time: event.time,
          level: event.level,
          message: _stringify(event.message),
          error: event.error == null ? null : _stringify(event.error),
        ),
      );
      while (_records.length > _capacity) {
        _records.removeFirst();
      }
      _revision.value++;
    } catch (_) {
      // 静默：日志失败绝不冒泡
    }
  }

  static String _stringify(Object? v) {
    if (v == null) return '';
    if (v is String) return v;
    try {
      return v.toString();
    } catch (_) {
      return '<unprintable ${v.runtimeType}>';
    }
  }

  void clear() {
    _records.clear();
    _revision.value++;
  }

  /// 导出为纯文本（按时间正序）。
  String export([Level minLevel = Level.trace]) =>
      recordsAtLeast(minLevel).map((r) => r.toText()).join('\n');
}