import 'dart:convert';
import 'dart:ffi';
import 'dart:io';
import 'dart:typed_data';

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
const int qjsTypeFunction = 9;
const int qjsTypePromise = 10;

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

// 通用的 Dart 回调处理器
typedef NativeAsyncTypedCallHandler = Void Function(
  Pointer<Void> ctx,
  NativeUtf8Ptr method,
  Pointer<QjsResult> args,
  Int32 argc,
  Pointer<QjsResult> out,
);

final class QuickJsFFI {
  final DynamicLibrary _lib;

  QuickJsFFI(this._lib);

  static DynamicLibrary load() {
    if (Platform.isIOS) {
      return DynamicLibrary.executable();
    }
    final libName = () {
      if (Platform.isAndroid || Platform.isLinux) return 'libquickjs_ffi.so';
      if (Platform.isMacOS) return 'libquickjs_ffi.dylib';
      if (Platform.isWindows) return 'quickjs_ffi.dll';
      return 'libquickjs_ffi.dylib';
    }();

    try {
      return DynamicLibrary.open(libName);
    } catch (e) {
      if (Platform.isMacOS) {
        final executableDir = File(Platform.resolvedExecutable).parent.path;
        final possiblePaths = [
          '$executableDir/../Frameworks/$libName',
          '$executableDir/$libName',
        ];

        for (final path in possiblePaths) {
          try {
            return DynamicLibrary.open(path);
          } catch (_) {}
        }
      }
      rethrow;
    }
  }

  // ---------------- FFI 绑定 ----------------

  late final _create =
      _lib.lookupFunction<Pointer<Void> Function(), Pointer<Void> Function()>(
          'qjs_create_runtime');
  late final _destroy = _lib.lookupFunction<Void Function(Pointer<Void>),
      void Function(Pointer<Void>)>('qjs_destroy_runtime');

  late final _evaluateValueOut = _lib.lookupFunction<
      Void Function(Pointer<Void>, Pointer<Void>, Int32, Pointer<QjsResult>),
      void Function(Pointer<Void>, Pointer<Void>, int,
          Pointer<QjsResult>)>('qjs_evaluate_value_out');

  late final _freeResult = _lib.lookupFunction<
      Void Function(Pointer<QjsResult>),
      void Function(Pointer<QjsResult>)>('qjs_free_result_content');

  late final _getGlobal = _lib.lookupFunction<
      Void Function(Pointer<Void>, Pointer<QjsResult>),
      void Function(
          Pointer<Void>, Pointer<QjsResult>)>('qjs_get_global_object');

  late final _setProperty = _lib.lookupFunction<
      Void Function(Pointer<Void>, Pointer<QjsResult>, Pointer<ffi.Utf8>,
          Pointer<QjsResult>),
      void Function(Pointer<Void>, Pointer<QjsResult>, Pointer<ffi.Utf8>,
          Pointer<QjsResult>)>('qjs_set_property');

  late final _getProperty = _lib.lookupFunction<
      Void Function(Pointer<Void>, Pointer<QjsResult>, Pointer<ffi.Utf8>,
          Pointer<QjsResult>),
      void Function(Pointer<Void>, Pointer<QjsResult>, Pointer<ffi.Utf8>,
          Pointer<QjsResult>)>('qjs_get_property');

  late final _newFunction = _lib.lookupFunction<
      Void Function(
          Pointer<Void>,
          Pointer<ffi.Utf8>,
          Pointer<NativeFunction<NativeAsyncTypedCallHandler>>,
          Pointer<QjsResult>),
      void Function(
          Pointer<Void>,
          Pointer<ffi.Utf8>,
          Pointer<NativeFunction<NativeAsyncTypedCallHandler>>,
          Pointer<QjsResult>)>('qjs_new_function');

  late final _callFunction = _lib.lookupFunction<
      Void Function(Pointer<Void>, Pointer<QjsResult>, Pointer<QjsResult>,
          Int32, Pointer<QjsResult>),
      void Function(Pointer<Void>, Pointer<QjsResult>, Pointer<QjsResult>, int,
          Pointer<QjsResult>)>('qjs_call_function');

  late final _invokeMethod = _lib.lookupFunction<
      Void Function(Pointer<Void>, Pointer<QjsResult>, Pointer<ffi.Utf8>,
          Pointer<QjsResult>, Int32, Pointer<QjsResult>),
      void Function(Pointer<Void>, Pointer<QjsResult>, Pointer<ffi.Utf8>,
          Pointer<QjsResult>, int, Pointer<QjsResult>)>('qjs_invoke_method');

  late final _runJobs = _lib.lookupFunction<Int32 Function(Pointer<Void>),
      int Function(Pointer<Void>)>('qjs_run_jobs');

  late final _asyncResolve = _lib.lookupFunction<
      Void Function(Pointer<Void>, Int32, Pointer<QjsResult>),
      void Function(
          Pointer<Void>, int, Pointer<QjsResult>)>('qjs_async_resolve_typed');

  late final _asyncReject = _lib.lookupFunction<
      Void Function(Pointer<Void>, Int32, Pointer<ffi.Utf8>),
      void Function(Pointer<Void>, int, Pointer<ffi.Utf8>)>('qjs_async_reject');

  // ---------------- 业务接口 ----------------

  Pointer<Void> createRuntime() => _create();
  void destroyRuntime(Pointer<Void> h) => _destroy(h);

  Pointer<QjsResult> getGlobalObject(Pointer<Void> h) {
    final out = ffi.calloc<QjsResult>();
    _getGlobal(h, out);
    return out;
  }

  void setProperty(Pointer<Void> h, Pointer<QjsResult> obj, String prop,
      Pointer<QjsResult> val) {
    final cprop = prop.toNativeUtf8();
    _setProperty(h, obj, cprop, val);
    ffi.malloc.free(cprop);
  }

  Pointer<QjsResult> getProperty(
      Pointer<Void> h, Pointer<QjsResult> obj, String prop) {
    final cstr = prop.toNativeUtf8();
    final out = ffi.calloc<QjsResult>();
    _getProperty(h, obj, cstr, out);
    ffi.malloc.free(cstr);
    return out;
  }

  Pointer<QjsResult> newFunction(Pointer<Void> h, String name,
      Pointer<NativeFunction<NativeAsyncTypedCallHandler>> cb) {
    final cname = name.toNativeUtf8();
    final out = ffi.calloc<QjsResult>();
    _newFunction(h, cname, cb, out);
    ffi.malloc.free(cname);
    return out;
  }

  dynamic callFunction(
      Pointer<Void> h, Pointer<QjsResult> obj, List<dynamic> args) {
    final out = ffi.calloc<QjsResult>();
    final cargs = ffi.calloc<QjsResult>(args.length);
    for (var i = 0; i < args.length; i++) {
      QuickJsFFI.writeOut(cargs + i, args[i]);
    }

    _callFunction(h, obj, cargs, args.length, out);

    for (var i = 0; i < args.length; i++) {
      _freeResult(cargs + i);
    }
    ffi.calloc.free(cargs);

    if (out.ref.error != 0) {
      final msg =
          out.ref.s.address == 0 ? 'Unknown error' : out.ref.s.toDartString();
      _freeResult(out);
      ffi.calloc.free(out);
      throw Exception(msg);
    }

    final res = convertQjsResultToDart(out.ref);
    _freeResult(out);
    ffi.calloc.free(out);
    return res;
  }

  dynamic invokeMethod(Pointer<Void> h, Pointer<QjsResult> obj, String name,
      List<dynamic> args) {
    final cname = name.toNativeUtf8();
    final out = ffi.calloc<QjsResult>();
    final cargs = ffi.calloc<QjsResult>(args.length);
    for (var i = 0; i < args.length; i++) {
      QuickJsFFI.writeOut(cargs + i, args[i]);
    }

    _invokeMethod(h, obj, cname, cargs, args.length, out);

    ffi.malloc.free(cname);
    for (var i = 0; i < args.length; i++) {
      _freeResult(cargs + i);
    }
    ffi.calloc.free(cargs);

    if (out.ref.error != 0) {
      final msg =
          out.ref.s.address == 0 ? 'Unknown error' : out.ref.s.toDartString();
      _freeResult(out);
      ffi.calloc.free(out);
      throw Exception(msg);
    }

    final res = convertQjsResultToDart(out.ref);
    _freeResult(out);
    ffi.calloc.free(out);
    return res;
  }

  dynamic eval(Pointer<Void> h, String code) {
    final cstr = code.toNativeUtf8();
    final out = ffi.calloc<QjsResult>();
    _evaluateValueOut(h, cstr.cast(), cstr.length, out);
    ffi.malloc.free(cstr);

    if (out.ref.error != 0) {
      final msg =
          out.ref.s.address == 0 ? 'Unknown error' : out.ref.s.toDartString();
      _freeResult(out);
      ffi.calloc.free(out);
      throw Exception(msg);
    }

    final res = convertQjsResultToDart(out.ref);
    _freeResult(out);
    ffi.calloc.free(out);
    return res;
  }

  dynamic evalWithBinary(Pointer<Void> h, Uint8List bytecode) {
    final ptr = ffi.malloc<Uint8>(bytecode.length);
    ptr.asTypedList(bytecode.length).setAll(0, bytecode);
    final out = ffi.calloc<QjsResult>();
    _evaluateValueOut(h, ptr.cast(), bytecode.length, out);
    ffi.malloc.free(ptr);

    if (out.ref.error != 0) {
      final msg =
          out.ref.s.address == 0 ? 'Unknown error' : out.ref.s.toDartString();
      _freeResult(out);
      ffi.calloc.free(out);
      throw Exception(msg);
    }

    final res = convertQjsResultToDart(out.ref);
    _freeResult(out);
    ffi.calloc.free(out);
    return res;
  }

  void freeQjsResult(Pointer<QjsResult> p) {
    _freeResult(p);
    ffi.calloc.free(p);
  }

  static dynamic convertQjsResultToDart(QjsResult res) {
    switch (res.type) {
      case qjsTypeUndefined:
      case qjsTypeNull:
        return null;
      case qjsTypeBool:
        return res.b != 0;
      case qjsTypeInt64:
        return res.i64;
      case qjsTypeFloat64:
        return res.f64;
      case qjsTypeString:
        return res.s.address == 0 ? '' : res.s.toDartString();
      case qjsTypeObject:
      case qjsTypeFunction:
        if (res.data.address == 0) {
          // 如果没有二进制数据，但有 i64 指针，说明是一个存活的 JS 对象引用
          if (res.i64 != 0) return true;
          return null;
        }
        final bytes = res.data.asTypedList(res.dataLen);
        final reader = _BinaryReader(bytes);
        return reader.read();
      default:
        return null;
    }
  }

  static void writeOut(Pointer<QjsResult> out, Object? v) {
    out.ref.error = 0;
    if (v is String) {
      out.ref.type = qjsTypeString;
      out.ref.s = v.toNativeUtf8();
    } else if (v == null) {
      out.ref.type = qjsTypeNull;
    } else if (v is bool) {
      out.ref.type = qjsTypeBool;
      out.ref.b = v ? 1 : 0;
    } else if (v is int) {
      out.ref.type = qjsTypeInt64;
      out.ref.i64 = v;
    } else if (v is double) {
      out.ref.type = qjsTypeFloat64;
      out.ref.f64 = v;
    } else {
      // 其他类型简单处理为 JSON/Binary
      out.ref.type = qjsTypeObject;
      final writer = _BinaryWriter();
      writer.write(v);
      final bytes = writer.takeBytes();
      final ptr = ffi.malloc<Uint8>(bytes.length);
      ptr.asTypedList(bytes.length).setAll(0, bytes);
      out.ref.data = ptr;
      out.ref.dataLen = bytes.length;
    }
  }

  int runJobs(Pointer<Void> h) {
    // 处理挂起的异步 Promise
    if (JSObject._pendingResolvers.isNotEmpty) {
      final ids = JSObject._pendingResolvers.keys.toList();
      for (final id in ids) {
        final val = JSObject._pendingResolvers.remove(id);
        final out = ffi.calloc<QjsResult>();
        QuickJsFFI.writeOut(out, val);
        _asyncResolve(h, id, out);
        freeQjsResult(out);
      }
    }
    if (JSObject._pendingRejections.isNotEmpty) {
      final ids = JSObject._pendingRejections.keys.toList();
      for (final id in ids) {
        final reason =
            JSObject._pendingRejections.remove(id) ?? 'Unknown error';
        final cstr = reason.toNativeUtf8();
        _asyncReject(h, id, cstr);
        ffi.malloc.free(cstr);
      }
    }
    return _runJobs(h);
  }
}

class QuickJsRuntime {
  final QuickJsFFI _ffi;
  final Pointer<Void> _handle;

  QuickJsRuntime(this._ffi) : _handle = _ffi.createRuntime();

  QuickJsContext createContext() {
    return QuickJsContext(_ffi, _handle);
  }

  void dispose() {
    _ffi.destroyRuntime(_handle);
  }
}

class QuickJsContext {
  final QuickJsFFI _ffi;
  final Pointer<Void> _runtimeHandle;
  late final JSObject global;

  QuickJsContext(this._ffi, this._runtimeHandle) {
    final globalRes = _ffi.getGlobalObject(_runtimeHandle);
    global = JSObject(_ffi, _runtimeHandle, globalRes);
  }

  dynamic eval(String code) {
    return _ffi.eval(_runtimeHandle, code);
  }

  dynamic evalBinary(Uint8List bytecode) {
    // 假设 evalBinary 是执行 QuickJS 编译后的字节码
    // 目前 FFI 层的 qjs_evaluate_value_out 接收的是 char*，
    // 如果 code 是字节码，len 应该反映真实字节数。
    // 这里我们先复用 eval 逻辑，但确保传递正确的字节长度。
    return _ffi.evalWithBinary(_runtimeHandle, bytecode);
  }

  String evalToString(String code) {
    final res = eval(code);
    return res?.toString() ?? 'null';
  }

  int runJobs() {
    return _ffi.runJobs(_runtimeHandle);
  }

  void dispose() {
    // 暂时不释放 runtime，因为 runtime 是由 QuickJsRuntime 管理的
  }
}

class JSObject {
  final QuickJsFFI _ffi;
  final Pointer<Void> _runtimeHandle;
  final Pointer<QjsResult> _handle;

  JSObject(this._ffi, this._runtimeHandle, this._handle);

  void setProperty(String name, dynamic value) {
    final valRes = ffi.calloc<QjsResult>();
    QuickJsFFI.writeOut(valRes, value);
    _ffi.setProperty(_runtimeHandle, _handle, name, valRes);
    _ffi.freeQjsResult(valRes);
  }

  dynamic getProperty(String name) {
    final res = _ffi.getProperty(_runtimeHandle, _handle, name);
    final dartVal = QuickJsFFI.convertQjsResultToDart(res.ref);
    if (res.ref.type == qjsTypeObject || res.ref.type == qjsTypeFunction) {
      // 如果是对象或函数，返回 JSObject 封装
      return JSObject(_ffi, _runtimeHandle, res);
    }
    _ffi.freeQjsResult(res);
    return dartVal;
  }

  dynamic callFunction(List<dynamic> args) {
    return _ffi.callFunction(_runtimeHandle, _handle, args);
  }

  dynamic invoke(String name, List<dynamic> args) {
    return _ffi.invokeMethod(_runtimeHandle, _handle, name, args);
  }

  void defineProperty(String name, Function callback) {
    final key = "${_runtimeHandle.address}_$name";
    // 检查是否已经注册过
    if (_callbacks.containsKey(key)) {
      // 如果已经注册过，直接更新回调即可，不需要重新在 JS 侧 defineProperty
      _callbacks[key] = callback;
      return;
    }

    final trampoline = Pointer.fromFunction<NativeAsyncTypedCallHandler>(
        _jsNativeCallTrampoline);
    final fnRes = _ffi.newFunction(_runtimeHandle, name, trampoline);
    _ffi.setProperty(_runtimeHandle, _handle, name, fnRes);

    // 保存回调以防止被 GC
    _callbacks[key] = callback;
    _ffi.freeQjsResult(fnRes);
  }

  static final Map<String, Function> _callbacks = {};

  static void _jsNativeCallTrampoline(
    Pointer<Void> runtimeHandle,
    NativeUtf8Ptr methodPtr,
    Pointer<QjsResult> argsPtr,
    int argc,
    Pointer<QjsResult> out,
  ) {
    final method = methodPtr.toDartString();
    final key = "${runtimeHandle.address}_$method";
    final callback = _callbacks[key];
    if (callback == null) {
      out.ref.error = 1;
      out.ref.s = 'Method not found: $method'.toNativeUtf8();
      return;
    }

    final args = [];
    for (var i = 0; i < argc; i++) {
      args.add(QuickJsFFI.convertQjsResultToDart(argsPtr[i]));
    }

    try {
      final result = Function.apply(callback, args);
      // 这里可以根据 result 类型设置 out
      // 简单处理：如果是 Future，可能需要返回 Promise
      if (result is Future) {
        // 分配一个 ID 给这个异步操作
        final id = _nextResolverId++;
        out.ref.type = qjsTypePromise;
        out.ref.i64 = id;

        result.then((value) {
          _pendingResolvers[id] = value;
        }).catchError((e) {
          _pendingRejections[id] = e.toString();
        });
      } else {
        // 正常返回值
        QuickJsFFI.writeOut(out, result);
      }
    } catch (e) {
      out.ref.error = 1;
      out.ref.s = e.toString().toNativeUtf8();
    }
  }

  static int _nextResolverId = 1;
  static final Map<int, dynamic> _pendingResolvers = {};
  static final Map<int, String> _pendingRejections = {};
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
      _builder
          .add((ByteData(8)..setInt64(0, v, Endian.host)).buffer.asUint8List());
    } else if (v is double) {
      _builder.addByte(_binaryTagFloat64);
      _builder.add(
          (ByteData(8)..setFloat64(0, v, Endian.host)).buffer.asUint8List());
    } else if (v is String) {
      _builder.addByte(_binaryTagString);
      final b = utf8.encode(v);
      _builder.add((ByteData(4)..setUint32(0, b.length, Endian.host))
          .buffer
          .asUint8List());
      _builder.add(b);
    } else if (v is List) {
      _builder.addByte(_binaryTagList);
      _builder.add((ByteData(4)..setUint32(0, v.length, Endian.host))
          .buffer
          .asUint8List());
      for (var e in v) write(e);
    } else if (v is Map) {
      _builder.addByte(_binaryTagMap);
      _builder.add((ByteData(4)..setUint32(0, v.length, Endian.host))
          .buffer
          .asUint8List());
      v.forEach((k, value) {
        write(k.toString());
        write(value);
      });
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
        return List.generate(len, (_) => read());
      case _binaryTagMap:
        final len = ByteData.sublistView(_bytes, _offset, _offset + 4)
            .getUint32(0, Endian.host);
        _offset += 4;
        final map = {};
        for (var i = 0; i < len; i++) {
          final k = read();
          map[k] = read();
        }
        return map;
      default:
        return null;
    }
  }
}
