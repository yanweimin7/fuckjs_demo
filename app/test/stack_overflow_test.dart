import 'dart:ffi';
import 'dart:io';
import 'package:flutter_test/flutter_test.dart';
import 'package:fuickjs_core/core/engine/quickjs_ffi.dart';
import 'package:fuickjs_core/core/engine/jscontext.dart';
import 'package:fuickjs_core/core/engine/runtime.dart';
import 'package:fuickjs_core/core/engine/jsobject.dart';
import 'package:fuickjs_core/core/utils/extensions.dart';

void main() {
  group('Stack Overflow Prevention Tests', () {
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

    test('Deeply nested JS object serialization (JS -> Dart)', () async {
      final ctx = runtime.createContext();

      // Create a deeply nested object in JS (depth 1200)
      // { n: { n: { ... } } }
      final jsCode = '''
        (function() {
          let root = { n: null };
          let curr = root;
          for (let i = 0; i < 1200; i++) {
            curr.n = { n: null };
            curr = curr.n;
          }
          return root;
        })();
      ''';

      final result = await ctx.eval(jsCode);

      // Verify result in Dart
      // It should be a Map with 'n' key, which is a Map, etc.
      expect(result, isA<Map>());

      int depth = 0;
      dynamic curr = result;
      while (curr is Map && curr.containsKey('n') && curr['n'] != null) {
        depth++;
        curr = curr['n'];
      }

      print('JS -> Dart serialization depth: $depth');
      expect(depth, greaterThan(1024));
      expect(depth, equals(1200)); // 1200 iterations

      ctx.dispose();
    });

    test('Deeply nested Dart object deserialization (Dart -> JS)', () async {
      final ctx = runtime.createContext();

      // Create a deeply nested Map in Dart (depth 1200)
      Map<String, dynamic> root = {'n': null};
      Map<String, dynamic> curr = root;
      for (int i = 0; i < 1200; i++) {
        Map<String, dynamic> next = {'n': null};
        curr['n'] = next;
        curr = next;
      }

      // Pass it to JS and verify depth
      await ctx.eval('''
        globalThis.measureDepth = function(obj) {
          let depth = 0;
          let curr = obj;
          while (curr && curr.n) {
            depth++;
            curr = curr.n;
          }
          return depth;
        };
      ''');

      final depthResult = await ctx.invoke(null, 'measureDepth', [root]);

      print('Dart -> JS deserialization depth: $depthResult');
      expect(depthResult, equals(1200));

      ctx.dispose();
    });

    test('Iterative fallback switch behavior', () async {
      final ctx = runtime.createContext();

      // 1. Disable iterative fallback
      qjs.setEnableIterativeFallback(false);

      // Try to serialize a deep object (depth 1200)
      // Expectation: It should fully serialize using recursion (if stack is large enough).
      // We removed the hard limit (512), so it should try to go all the way.
      // On macOS host, stack is large enough for 1200 frames.
      final jsCode = '''
        (function() {
          let root = { n: null };
          let curr = root;
          for (let i = 0; i < 1200; i++) {
            curr.n = { n: null };
            curr = curr.n;
          }
          return root;
        })();
      ''';

      final resultDisabled = await ctx.eval(jsCode);

      int depthDisabled = 0;
      dynamic currDisabled = resultDisabled;
      while (currDisabled is Map &&
          currDisabled.containsKey('n') &&
          currDisabled['n'] != null) {
        depthDisabled++;
        currDisabled = currDisabled['n'];
      }
      print('Serialization depth with fallback disabled: $depthDisabled');
      // Should be full depth
      expect(depthDisabled, equals(1200));

      // 2. Enable iterative fallback
      qjs.setEnableIterativeFallback(true);

      final resultEnabled = await ctx.eval(jsCode);
      int depthEnabled = 0;
      dynamic currEnabled = resultEnabled;
      while (currEnabled is Map &&
          currEnabled.containsKey('n') &&
          currEnabled['n'] != null) {
        depthEnabled++;
        currEnabled = currEnabled['n'];
      }
      print('Serialization depth with fallback enabled: $depthEnabled');
      expect(depthEnabled, equals(1200));

      ctx.dispose();
    });
  });
}
