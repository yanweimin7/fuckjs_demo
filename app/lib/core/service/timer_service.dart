import 'dart:async';

import 'package:flutter/cupertino.dart';

import 'BaseFuickService.dart';

class TimerService extends BaseFuickService {
  final Map<int, Timer> timers = {};

  TimerService() {
    registerMethod('createTimer', (args) {
      final m = args is Map ? args : {};
      final id = (m['id'] as num).toInt();

      // 先尝试取消已存在的同名定时器，防止重复
      timers.remove(id)?.cancel();

      final delay = (m['delay'] as num?)?.toInt() ?? 0;
      final isInterval = (m['isInterval'] ?? false) as bool;

      if (isInterval) {
        timers[id] = Timer.periodic(Duration(milliseconds: delay), (timer) {
          if (isDisposed) {
            timer.cancel();
            return;
          }
          try {
            ctx.invoke(null, '__handleTimer', [id]);
          } catch (e) {
            timer.cancel();
            timers.remove(id);
          }
        });
      } else {
        timers[id] = Timer(Duration(milliseconds: delay), () {
          if (isDisposed) return;
          timers.remove(id);
          try {
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
      final id = (m['id'] as num).toInt();
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
