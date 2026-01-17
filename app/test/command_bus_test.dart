import 'package:flutter_test/flutter_test.dart';
import 'package:fuickjs_core/core/service/fuick_command_bus.dart';

void main() {
  group('FuickCommandBus Isolation Tests', () {
    late FuickCommandBus bus;

    setUp(() {
      bus = FuickCommandBus();
    });

    test('should isolate commands by JSContext (multi-instance)', () {
      final bus1 = FuickCommandBus();
      final bus2 = FuickCommandBus();

      final log1 = <String>[];
      final log2 = <String>[];

      bus1.addListener('page1:ref1', (m, a) => log1.add(m));
      bus2.addListener('page1:ref1', (m, a) => log2.add(m));

      bus1.dispatch('page1:ref1', 'cmd1', null);
      expect(log1, ['cmd1']);
      expect(log2, isEmpty);

      bus2.dispatch('page1:ref1', 'cmd2', null);
      expect(log1, ['cmd1']);
      expect(log2, ['cmd2']);
    });

    test('should isolate commands by scoped refId within same bus', () {
      int count = 0;
      void listener(String method, dynamic args) => count++;

      bus.addListener('page1:ref1', listener);
      bus.dispatch('page1:ref1', 'test', null);
      expect(count, 1);

      bus.removeListener('page1:ref1', listener);
      bus.dispatch('page1:ref1', 'test', null);
      expect(count, 1);
    });

    test('should handle multiple listeners for same scoped refId', () {
      int count1 = 0;
      int count2 = 0;

      bus.addListener('page1:ref1', (m, a) => count1++);
      bus.addListener('page1:ref1', (m, a) => count2++);

      bus.dispatch('page1:ref1', 'test', null);
      expect(count1, 1);
      expect(count2, 1);
    });
  });
}
