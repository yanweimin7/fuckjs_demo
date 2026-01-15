import 'dart:ffi';
import 'dart:io';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_quickjs/core/engine/quickjs_ffi.dart';
import 'package:flutter_quickjs/core/engine/jscontext.dart';
import 'package:flutter_quickjs/core/engine/runtime.dart';
import 'package:flutter_quickjs/core/engine/jsobject.dart';
import 'package:flutter_quickjs/core/utils/extensions.dart';

void main() {
  group('QuickJS Engine Tests', () {
    late QuickJsFFI qjs;
    late QuickJsRuntime runtime;

    setUpAll(() {
      try {
        // Try default load
        final lib = QuickJsFFI.load();
        qjs = QuickJsFFI(lib);
      } catch (e) {
        // Fallback to absolute path for test environment
        final path =
            '/Users/wey/work/flutter_dynamic/fuickjs_pro/app/macos/Runner/libquickjs_ffi.dylib';
        if (File(path).existsSync()) {
          final lib = DynamicLibrary.open(path);
          qjs = QuickJsFFI(lib);
        } else {
          throw Exception(
              'Could not load libquickjs_ffi.dylib from default or $path. Error: $e');
        }
      }
      runtime = QuickJsRuntime(qjs);
    });

    tearDownAll(() {
      runtime.dispose();
    });

    test('Context creation and disposal', () {
      final ctx = runtime.createContext();
      expect(ctx, isNotNull);
      ctx.dispose();
    });

    test('Evaluate simple expression', () async {
      final ctx = runtime.createContext();
      final result = await ctx.eval('1 + 2');
      expect(result, 3);
      ctx.dispose();
    });

    test('Global property definition and invocation', () {
      final ctx = runtime.createContext();
      ctx.global.defineProperty('add', (a, b) {
        return asInt(a) + asInt(b);
      });
      final result = ctx.invoke(null, 'add', [10, 20]);
      expect(result, 30);
      ctx.dispose();
    });

    test('JSObject lifecycle and reference counting', () {
      final ctx = runtime.createContext();

      // Create a JS object
      ctx.eval('globalThis.obj = { x: 10 };');
      final obj = ctx.global.getProperty('obj') as JSObject;
      expect(obj, isNotNull);

      final x = obj.getProperty('x');
      expect(x, 10);

      // Explicit dispose
      obj.dispose();

      // Should not crash when disposing context
      ctx.dispose();
    });

    test('Invoke caching performance/correctness', () {
      final ctx = runtime.createContext();
      ctx.eval('''
        globalThis.calculator = {
          add: function(a, b) { return a + b; }
        };
      ''');

      // First call (cache miss)
      final res1 = ctx.invoke('calculator', 'add', [1, 2]);
      expect(res1, 3);

      // Second call (cache hit)
      final res2 = ctx.invoke('calculator', 'add', [3, 4]);
      expect(res2, 7);

      ctx.dispose();
    });

    test('Memory leak prevention (WeakReference)', () async {
      final ctx = runtime.createContext();

      // Create many objects but don't hold them
      for (int i = 0; i < 100; i++) {
        ctx.eval('globalThis.temp$i = { val: $i };');
        // We get property but don't keep it long term in this loop scope
        // Ideally we would want to check if they are tracked and then disposed
        final obj = ctx.global.getProperty('temp$i');
        // obj is now tracked by context
      }

      // Dispose context - this should trigger batch disposal of any tracked objects
      ctx.dispose();

      // If we are here without crash, it's good.
    });
  });
}
