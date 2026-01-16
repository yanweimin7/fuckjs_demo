import 'dart:async';

import 'package:flutter/widgets.dart';

import '../utils/extensions.dart';
import 'BaseFuickService.dart';

class TimerService extends BaseFuickService {
  final Map<int, Timer> timers = {};

  TimerService() {
    registerMethod('createTimer', (args) {
      final m = args is Map ? args : {};
      final id = asInt(m['id']);

      // 先尝试取消已存在的同名定时器，防止重复
      timers.remove(id)?.cancel();

      final delay = asIntOrNull(m['delay']) ?? 0;
      final isInterval = (m['isInterval'] ?? false) as bool;

      if (isInterval) {
        timers[id] = Timer.periodic(Duration(milliseconds: delay), (
          timer,
        ) async {
          if (isDisposed) {
            timer.cancel();
            return;
          }
          try {
            // Use __invokeAsync to break stack depth
            ctx.invoke(null, '__handleTimer', [id]);
          } catch (e) {
            timer.cancel();
            timers.remove(id);
          }
        });
      } else {
        timers[id] = Timer(Duration(milliseconds: delay), () async {
          if (isDisposed) return;
          timers.remove(id);
          try {
            // Use __invokeAsync to break stack depth
            ctx.invoke(null, '__handleTimer', [id]);
          } catch (e) {
            debugPrint('Error calling __handleTimer: $e');
          }
        });
      }
      return null;
    });

    registerMethod('deleteTimer', (args) {
      final m = args is Map ? args : {};
      final id = asInt(m['id']);
      timers.remove(id)?.cancel();
      return null;
    });
  }

  @override
  void dispose() {
    for (final timer in timers.values) {
      timer.cancel();
    }
    timers.clear();
    super.dispose();
  }
}
