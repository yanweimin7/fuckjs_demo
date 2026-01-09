import 'dart:convert';
import 'dart:ffi';
import 'dart:io';

import 'package:ffi/ffi.dart' as ffi;
import 'package:flutter/foundation.dart';

const int qjsTypeUndefined = 0;
const int qjsTypeNull = 1;
const int qjsTypeBool = 2;
const int qjsTypeInt64 = 3;
const int qjsTypeFloat64 = 4;
const int qjsTypeString = 5;
const int qjsTypeBigint = 6;
const int qjsTypeObject = 7;
const int qjsTypeByteArray = 8;

const int _binaryTagNull = 0;
const int _binaryTagBool = 1;
const int _binaryTagInt64 = 2;
const int _binaryTagFloat64 = 3;
const int _binaryTagString = 4;
const int _binaryTagList = 5;
const int _binaryTagMap = 6;

typedef NativeUtf8Ptr = Pointer<ffi.Utf8>;

final class QjsResult extends Struct {
  @Int32()
  external int type;

  @Int32()
  external int error;

  @Int64()
  external int i64;

  @Double()
  external double f64;

  @Uint8()
  external int b;

  external Pointer<ffi.Utf8> s;

  external Pointer<Uint8> data;

  @Int32()
  external int dataLen;
}

typedef NativeNativeCallHandler = Void Function(
  Pointer<Void> ctx,
  NativeUtf8Ptr method,
  Pointer<QjsResult> args,
  Int32 argc,
  Pointer<QjsResult> out,
);
typedef DartNativeCallHandler = void Function(
  Pointer<Void> ctx,
  NativeUtf8Ptr method,
  Pointer<QjsResult> args,
  int argc,
  Pointer<QjsResult> out,
);

typedef NativeRegisterCallNative = Void Function(
  Pointer<Void> handle,
  Pointer<NativeFunction<NativeNativeCallHandler>> cb,
);
typedef DartRegisterCallNative = void Function(
  Pointer<Void> handle,
  Pointer<NativeFunction<NativeNativeCallHandler>> cb,
);

typedef NativeRegisterCallAsyncDefer = Void Function(
  Pointer<Void>,
  Pointer<
      NativeFunction<
          Void Function(
            Pointer<Void>,
            NativeUtf8Ptr,
            Pointer<QjsResult>,
            Int32,
            Int32,
          )>>,
);
typedef DartRegisterCallAsyncDefer = void Function(
  Pointer<Void>,
  Pointer<
      NativeFunction<
          Void Function(
            Pointer<Void>,
            NativeUtf8Ptr,
            Pointer<QjsResult>,
            Int32,
            Int32,
          )>>,
);

typedef NativeAsyncTypedCallHandler = Void Function(
  Pointer<Void> ctx,
  NativeUtf8Ptr method,
  Pointer<QjsResult> args,
  Int32 argc,
  Pointer<QjsResult> out,
);

typedef NativeAsyncDeferCallHandler = Void Function(
  Pointer<Void> ctx,
  NativeUtf8Ptr method,
  Pointer<QjsResult> args,
  Int32 argc,
  Int32 id,
);

final class QuickJsFFI {
  final DynamicLibrary _lib;

  QuickJsFFI(this._lib);

  static DynamicLibrary load() {
    if (Platform.isIOS) {
      // iOS 静态链接时使用 executable()
      return DynamicLibrary.executable();
    }
    final libName = () {
      if (Platform.isAndroid || Platform.isLinux) return 'libquickjs_ffi.so';
      if (Platform.isMacOS) return 'libquickjs_ffi.dylib';
      if (Platform.isWindows) return 'quickjs_ffi.dll';
      return 'libquickjs_ffi.dylib';
    }();

    try {
      // 1. 尝试直接加载 (系统路径或已打包的 Framework)
      return DynamicLibrary.open(libName);
    } catch (e) {
      if (Platform.isMacOS) {
        // macOS 特有的沙盒和开发路径处理
        final executableDir = File(Platform.resolvedExecutable).parent.path;
        final possiblePaths = [
          // 2. 尝试在 App Bundle 的 Frameworks 目录下寻找 (打包后的位置)
          '$executableDir/../Frameworks/$libName',
          // 3. 尝试在当前执行目录寻找
          '$executableDir/$libName',
        ];

        Object? lastError = e;
        for (final path in possiblePaths) {
          try {
            final l = DynamicLibrary.open(path);
            debugPrint('Successfully loaded $libName from $path');
            return l;
          } catch (err) {
            lastError = err;
          }
        }

        // 如果都失败了，给出一个关于沙盒的友情提示
        throw Exception(
          'Failed to load $libName. \n'
          'Last error: $lastError\n'
          'Hint: If you see "file system sandbox blocked open()", please ensure:\n'
          '1. The dylib is added to "Frameworks, Libraries, and Embedded Content" in Xcode.\n'
          '2. Or disable App Sandbox in macos/Runner/DebugProfile.entitlements for local dev.',
        );
      }
      rethrow;
    }
  }

  static final Map<int, Object? Function(String, List<dynamic>)>
      _cbCallAsyncTypedByCtx = {};
  static final Map<int, void Function(String, List<dynamic>, int)>
      _cbCallStartByCtx = {};
  static final Map<int, Object? Function(String, List<dynamic>)>
      _cbCallNativeByCtx = {};

  @pragma('vm:entry-point')
  static void _cbCallNativeTrampoline(
    Pointer<Void> ctx,
    Pointer<ffi.Utf8> method,
    Pointer<QjsResult> args,
    int argc,
    Pointer<QjsResult> out,
  ) {
    final f = _cbCallNativeByCtx[ctx.address];
    if (f == null) return;

    final m = method.address == 0 ? '' : method.toDartString();
    final List<dynamic> dartArgs = [];
    for (int i = 0; i < argc; i++) {
      final arg = args[i];
      dartArgs.add(_convertQjsResultToDart(arg));
    }

    try {
      final res = f(m, dartArgs);
      _writeOut(out, res);
    } catch (e) {
      out.ref.error = 1;
      out.ref.type = qjsTypeString;
      out.ref.s = e.toString().toNativeUtf8();
    }
  }

  static dynamic _convertQjsResultToDart(QjsResult res) {
    switch (res.type) {
      case qjsTypeUndefined:
      case qjsTypeNull:
        return null;
      case qjsTypeBool:
        return res.b != 0;
      case qjsTypeInt64:
        return res.i64;
      case qjsTypeFloat64:
        final d = res.f64;
        if (d == d.toInt().toDouble()) {
          return d.toInt();
        }
        return d;
      case qjsTypeString:
        return res.s.address == 0 ? '' : res.s.toDartString();
      case qjsTypeObject:
        if (res.data.address == 0) return null;
        final bytes = res.data.asTypedList(res.dataLen);
        final reader = _BinaryReader(bytes);
        return reader.read();
      case qjsTypeByteArray:
        if (res.data.address == 0) return null;
        return res.data.asTypedList(res.dataLen);
      default:
        return null;
    }
  }

  @pragma('vm:entry-point')
  static void _cbCallAsyncTypedTrampoline(
    Pointer<Void> ctx,
    Pointer<ffi.Utf8> method,
    Pointer<QjsResult> args,
    int argc,
    Pointer<QjsResult> out,
  ) {
    final f = _cbCallAsyncTypedByCtx[ctx.address];
    if (f == null) return;
    final m = method.address == 0 ? '' : method.toDartString();
    final List<dynamic> dartArgs = [];
    for (int i = 0; i < argc; i++) {
      final arg = args[i];
      dartArgs.add(_convertQjsResultToDart(arg));
    }
    final obj = f(m, dartArgs);
    _writeOut(out, obj);
  }

  @pragma('vm:entry-point')
  static void _cbCallStartTrampoline(
    Pointer<Void> ctx,
    Pointer<ffi.Utf8> method,
    Pointer<QjsResult> args,
    int argc,
    int id,
  ) {
    final f = _cbCallStartByCtx[ctx.address];
    if (f == null) return;
    final m = method.address == 0 ? '' : method.toDartString();
    final List<dynamic> dartArgs = [];
    for (int i = 0; i < argc; i++) {
      final arg = args[i];
      dartArgs.add(_convertQjsResultToDart(arg));
    }
    f(m, dartArgs, id);
  }

  late final _create = _lib
      .lookup<NativeFunction<Pointer<Void> Function()>>('qjs_create_runtime')
      .asFunction<Pointer<Void> Function()>();

  late final _createCtx = _lib
      .lookup<NativeFunction<Pointer<Void> Function(Pointer<Void>)>>(
        'qjs_create_context',
      )
      .asFunction<Pointer<Void> Function(Pointer<Void>)>();

  late final _destroy = _lib
      .lookup<NativeFunction<Void Function(Pointer<Void>)>>(
        'qjs_destroy_runtime',
      )
      .asFunction<void Function(Pointer<Void>)>();

  late final _destroyCtx = _lib
      .lookup<NativeFunction<Void Function(Pointer<Void>)>>(
        'qjs_destroy_context',
      )
      .asFunction<void Function(Pointer<Void>)>();

  late final _evalVal = _lib
      .lookup<
          NativeFunction<
              Void Function(
                Pointer<Void>,
                Pointer<ffi.Utf8>,
                Int32,
                Pointer<QjsResult>,
              )>>('qjs_evaluate_value_out')
      .asFunction<
          void Function(
              Pointer<Void>, Pointer<ffi.Utf8>, int, Pointer<QjsResult>)>();

  late final _evalBinary = _lib
      .lookup<
          NativeFunction<
              Void Function(
                Pointer<Void>,
                Pointer<Uint8>,
                Int32,
                Pointer<QjsResult>,
              )>>('qjs_evaluate_binary')
      .asFunction<
          void Function(
              Pointer<Void>, Pointer<Uint8>, int, Pointer<QjsResult>)>();

  late final _freeVal = _lib
      .lookup<NativeFunction<Void Function(Pointer<QjsResult>)>>(
        'qjs_free_value',
      )
      .asFunction<void Function(Pointer<QjsResult>)>();

  late final _registerCallAsyncTyped = _lib
      .lookup<
          NativeFunction<
              Void Function(
                Pointer<Void>,
                Pointer<NativeFunction<NativeAsyncTypedCallHandler>>,
              )>>('qjs_register_call_async_typed')
      .asFunction<
          void Function(
            Pointer<Void>,
            Pointer<NativeFunction<NativeAsyncTypedCallHandler>>,
          )>();

  late final _registerCallAsyncDefer = _lib
      .lookup<NativeFunction<NativeRegisterCallAsyncDefer>>(
        'qjs_register_call_async_defer',
      )
      .asFunction<DartRegisterCallAsyncDefer>();

  late final _asyncResolveTyped = _lib
      .lookup<
          NativeFunction<
              Void Function(Pointer<Void>, Int32, Pointer<QjsResult>,
                  Int32)>>('qjs_async_resolve_typed')
      .asFunction<void Function(Pointer<Void>, int, Pointer<QjsResult>, int)>();

  late final _registerCallNative = _lib
      .lookup<NativeFunction<NativeRegisterCallNative>>(
        'qjs_register_call_native',
      )
      .asFunction<DartRegisterCallNative>();

  late final _runJobs = _lib
      .lookup<NativeFunction<Int32 Function(Pointer<Void>, Int32)>>(
        'qjs_run_jobs',
      )
      .asFunction<int Function(Pointer<Void>, int)>();

  late final _callFn = _lib
      .lookup<
          NativeFunction<
              Void Function(
                Pointer<Void>,
                Pointer<ffi.Utf8>,
                Pointer<ffi.Utf8>,
                Pointer<QjsResult>,
              )>>('qjs_call_function')
      .asFunction<
          void Function(
            Pointer<Void>,
            Pointer<ffi.Utf8>,
            Pointer<ffi.Utf8>,
            Pointer<QjsResult>,
          )>();

  Pointer<Void> createRuntime() => _create();

  void destroyRuntime(Pointer<Void> h) => _destroy(h);

  Pointer<Void> createContext(Pointer<Void> rh) => _createCtx(rh);

  void destroyContext(Pointer<Void> ch) => _destroyCtx(ch);

  String evalToString(Pointer<Void> h, String code) {
    return eval(h, code).toString();
  }

  dynamic eval(Pointer<Void> h, String code, {bool resolvePromise = true}) {
    final cstr = code.toNativeUtf8();
    final out = ffi.calloc<QjsResult>();
    _evalVal(h, cstr, resolvePromise ? 1 : 0, out);
    ffi.malloc.free(cstr);
    final err = out.ref.error != 0;
    if (err) {
      final msg = out.ref.s == Pointer<ffi.Utf8>.fromAddress(0)
          ? 'Unknown error'
          : out.ref.s.toDartString();
      _freeVal(out);
      ffi.calloc.free(out);
      throw Exception(msg);
    }

    final res = _convertQjsResultToDart(out.ref);
    _freeVal(out);
    ffi.calloc.free(out);
    return res;
  }

  dynamic evalBinary(Pointer<Void> h, Uint8List data) {
    final out = ffi.calloc<QjsResult>();
    // 直接使用 Uint8List 的内存，避免在 Dart 层手动分配和拷贝
    final Pointer<Uint8> ptr = ffi.malloc<Uint8>(data.length);
    final typedList = ptr.asTypedList(data.length);
    typedList.setAll(0, data);

    _evalBinary(h, ptr, data.length, out);
    ffi.malloc.free(ptr);

    final err = out.ref.error != 0;
    if (err) {
      final msg = out.ref.s == Pointer<ffi.Utf8>.fromAddress(0)
          ? 'Unknown error'
          : out.ref.s.toDartString();
      _freeVal(out);
      ffi.calloc.free(out);
      throw Exception(msg);
    }

    final res = _convertQjsResultToDart(out.ref);
    _freeVal(out);
    ffi.calloc.free(out);
    return res;
  }

  void registerCallNative(
    Pointer<Void> h,
    Object? Function(String, List<dynamic>) cb,
  ) {
    _cbCallNativeByCtx[h.address] = cb;
    final ptr = Pointer.fromFunction<NativeNativeCallHandler>(
      QuickJsFFI._cbCallNativeTrampoline,
    );
    _registerCallNative(h, ptr);
  }

  void registerCallAsyncTyped(
    Pointer<Void> h,
    Object? Function(String, List<dynamic>) cb,
  ) {
    _cbCallAsyncTypedByCtx[h.address] = cb;
    final ptr = Pointer.fromFunction<NativeAsyncTypedCallHandler>(
      QuickJsFFI._cbCallAsyncTypedTrampoline,
    );
    _registerCallAsyncTyped(h, ptr);
  }

  void registerCallAsyncDefer(
    Pointer<Void> h,
    void Function(String, List<dynamic>, int) cb,
  ) {
    _cbCallStartByCtx[h.address] = cb;
    final ptr = Pointer.fromFunction<
        Void Function(
          Pointer<Void>,
          NativeUtf8Ptr,
          Pointer<QjsResult>,
          Int32,
          Int32,
        )>(QuickJsFFI._cbCallStartTrampoline);
    _registerCallAsyncDefer(h, ptr);
  }

  void asyncResolveTyped(
    Pointer<Void> h,
    int id,
    Object? result, {
    bool isError = false,
  }) {
    final out = ffi.calloc<QjsResult>();
    _writeOut(out, result);
    _asyncResolveTyped(h, id, out, isError ? 1 : 0);
    if (out.ref.s.address != 0) {
      ffi.malloc.free(out.ref.s);
    }
    ffi.calloc.free(out);
  }

  void asyncRejectTyped(Pointer<Void> h, int id, Object? error) {
    asyncResolveTyped(h, id, error, isError: true);
  }

  int runJobs(Pointer<Void> h, {int maxJobs = 0}) {
    return _runJobs(h, maxJobs);
  }

  dynamic callFunction(Pointer<Void> h, String objectPath, List<dynamic> args) {
    final pathPtr = objectPath.toNativeUtf8();
    final argsJson = jsonEncode(args);
    final argsPtr = argsJson.toNativeUtf8();
    final out = ffi.calloc<QjsResult>();

    _callFn(h, pathPtr, argsPtr, out);

    ffi.malloc.free(pathPtr);
    ffi.malloc.free(argsPtr);

    final err = out.ref.error != 0;
    if (err) {
      final msg = out.ref.s == Pointer<ffi.Utf8>.fromAddress(0)
          ? 'Unknown error'
          : out.ref.s.toDartString();
      _freeVal(out);
      ffi.calloc.free(out);
      throw Exception('JS Function Call Error: $msg');
    }

    final result = _convertQjsResultToDart(out.ref);
    _freeVal(out);
    ffi.calloc.free(out);
    return result;
  }

  void _clearCallbacks(Pointer<Void> h) {
    final k = h.address;
    _cbCallAsyncTypedByCtx.remove(k);
    _cbCallStartByCtx.remove(k);
    _cbCallNativeByCtx.remove(k);
  }

  static void _writeOut(Pointer<QjsResult> out, Object? v) {
    final r = out.ref;
    r.error = 0;
    r.i64 = 0;
    r.f64 = 0.0;
    r.b = 0;
    r.s = Pointer<ffi.Utf8>.fromAddress(0);
    r.data = Pointer<Uint8>.fromAddress(0);
    r.dataLen = 0;

    if (v is String) {
      r.type = qjsTypeString;
      r.s = v.toNativeUtf8();
    } else if (v == null) {
      r.type = qjsTypeNull;
    } else if (v is bool) {
      r.type = qjsTypeBool;
      r.b = v ? 1 : 0;
    } else if (v is int) {
      r.type = qjsTypeInt64;
      r.i64 = v;
    } else if (v is double) {
      r.type = qjsTypeFloat64;
      r.f64 = v;
    } else if (v is Map || v is List) {
      r.type = qjsTypeObject;
      final writer = _BinaryWriter();
      writer.write(v);
      final bytes = writer.takeBytes();
      final ptr = ffi.malloc<Uint8>(bytes.length);
      ptr.asTypedList(bytes.length).setAll(0, bytes);
      r.data = ptr;
      r.dataLen = bytes.length;
    } else if (v is Uint8List) {
      r.type = qjsTypeByteArray;
      final ptr = ffi.malloc<Uint8>(v.length);
      ptr.asTypedList(v.length).setAll(0, v);
      r.data = ptr;
      r.dataLen = v.length;
    } else {
      // Fallback to binary for other objects
      r.type = qjsTypeObject;
      final writer = _BinaryWriter();
      writer.write(v);
      final bytes = writer.takeBytes();
      final ptr = ffi.malloc<Uint8>(bytes.length);
      ptr.asTypedList(bytes.length).setAll(0, bytes);
      r.data = ptr;
      r.dataLen = bytes.length;
    }
  }
}

class _BinaryWriter {
  final BytesBuilder _builder = BytesBuilder();

  void write(dynamic v) {
    if (v == null) {
      _builder.addByte(_binaryTagNull);
    } else if (v is bool) {
      _builder.addByte(_binaryTagBool);
      _builder.addByte(v ? 1 : 0);
    } else if (v is int) {
      _builder.addByte(_binaryTagInt64);
      final data = ByteData(8)..setInt64(0, v, Endian.host);
      _builder.add(data.buffer.asUint8List());
    } else if (v is double) {
      _builder.addByte(_binaryTagFloat64);
      final data = ByteData(8)..setFloat64(0, v, Endian.host);
      _builder.add(data.buffer.asUint8List());
    } else if (v is String) {
      _builder.addByte(_binaryTagString);
      final bytes = utf8.encode(v);
      final lenData = ByteData(4)..setUint32(0, bytes.length, Endian.host);
      _builder.add(lenData.buffer.asUint8List());
      _builder.add(bytes);
    } else if (v is List) {
      _builder.addByte(_binaryTagList);
      final lenData = ByteData(4)..setUint32(0, v.length, Endian.host);
      _builder.add(lenData.buffer.asUint8List());
      for (final item in v) {
        write(item);
      }
    } else if (v is Map) {
      _builder.addByte(_binaryTagMap);
      final lenData = ByteData(4)..setUint32(0, v.length, Endian.host);
      _builder.add(lenData.buffer.asUint8List());
      v.forEach((key, value) {
        write(key.toString()); // Keys are always strings in JS objects
        write(value);
      });
    } else {
      _builder.addByte(_binaryTagNull);
    }
  }

  Uint8List takeBytes() => _builder.takeBytes();
}

class _BinaryReader {
  final Uint8List _bytes;
  int _offset = 0;

  _BinaryReader(this._bytes);

  dynamic read() {
    if (_offset >= _bytes.length) return null;
    final tag = _bytes[_offset++];
    switch (tag) {
      case _binaryTagNull:
        return null;
      case _binaryTagBool:
        return _bytes[_offset++] != 0;
      case _binaryTagInt64:
        final v = ByteData.sublistView(_bytes, _offset, _offset + 8)
            .getInt64(0, Endian.host);
        _offset += 8;
        return v;
      case _binaryTagFloat64:
        final v = ByteData.sublistView(_bytes, _offset, _offset + 8)
            .getFloat64(0, Endian.host);
        _offset += 8;
        return v;
      case _binaryTagString:
        final len = ByteData.sublistView(_bytes, _offset, _offset + 4)
            .getUint32(0, Endian.host);
        _offset += 4;
        final s = utf8.decode(_bytes.sublist(_offset, _offset + len));
        _offset += len;
        return s;
      case _binaryTagList:
        final len = ByteData.sublistView(_bytes, _offset, _offset + 4)
            .getUint32(0, Endian.host);
        _offset += 4;
        final list = [];
        for (var i = 0; i < len; i++) {
          list.add(read());
        }
        return list;
      case _binaryTagMap:
        final len = ByteData.sublistView(_bytes, _offset, _offset + 4)
            .getUint32(0, Endian.host);
        _offset += 4;
        final map = {};
        for (var i = 0; i < len; i++) {
          final key = read();
          final value = read();
          map[key] = value;
        }
        return map;
      default:
        return null;
    }
  }
}

class QuickJsRuntime {
  final QuickJsFFI _ffi;
  final Pointer<Void> _handle;

  QuickJsRuntime(this._ffi) : _handle = _ffi.createRuntime();

  QuickJsContext createContext() {
    return QuickJsContext(_ffi, this, _ffi.createContext(_handle));
  }

  void dispose() {
    _ffi.destroyRuntime(_handle);
  }
}

class QuickJsContext {
  final QuickJsFFI _ffi;
  final QuickJsRuntime runtime;
  final Pointer<Void> _handle;

  QuickJsContext(this._ffi, this.runtime, this._handle);

  Pointer<Void> get handle => _handle;

  String evalToString(String code) => _ffi.evalToString(_handle, code);

  dynamic eval(String code, {bool resolvePromise = true}) =>
      _ffi.eval(_handle, code, resolvePromise: resolvePromise);

  dynamic evalBinary(Uint8List data) => _ffi.evalBinary(_handle, data);

  void registerCallNative(Object? Function(String, List<dynamic>) cb) =>
      _ffi.registerCallNative(_handle, cb);

  void registerCallAsyncTyped(Object? Function(String, List<dynamic>) cb) =>
      _ffi.registerCallAsyncTyped(_handle, cb);

  void registerCallAsyncDefer(void Function(String, List<dynamic>, int) cb) =>
      _ffi.registerCallAsyncDefer(_handle, cb);

  void asyncResolveTyped(int id, Object? result, {bool isError = false}) =>
      _ffi.asyncResolveTyped(_handle, id, result, isError: isError);

  void asyncRejectTyped(int id, Object? error) =>
      _ffi.asyncRejectTyped(_handle, id, error);

  int runJobs({int maxJobs = 0}) => _ffi.runJobs(_handle, maxJobs: maxJobs);

  dynamic callFunction(String objectPath, List<dynamic> args) =>
      _ffi.callFunction(_handle, objectPath, args);

  void dispose() {
    _ffi._clearCallbacks(_handle);
    _ffi.destroyContext(_handle);
  }
}
