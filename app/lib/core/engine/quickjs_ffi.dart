import 'dart:convert';
import 'dart:ffi';
import 'dart:io';
import 'dart:typed_data';

import 'package:ffi/ffi.dart' as ffi;
import 'package:flutter/foundation.dart';

import 'jsobject.dart';

/**
 * QuickJS 桥接层 Dart 实现
 * 
 * 该文件提供了 QuickJS 引擎的 Dart 封装，支持：
 * 1. 同步/异步方法调用。
 * 2. 多 Context 状态隔离。
 * 3. 自动内存管理 (QjsResult 转换与释放)。
 * 4. JS Promise 与 Dart Future 的互转。
 */

// JS 数据类型常量 (需与 C 侧 QjsType 保持一致)
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

// 二进制协议标签 (用于对象/数组的序列化)
const int _binaryTagNull = 0;
const int _binaryTagBool = 1;
const int _binaryTagInt64 = 2;
const int _binaryTagFloat64 = 3;
const int _binaryTagString = 4;
const int _binaryTagList = 5;
const int _binaryTagMap = 6;

typedef NativeUtf8Ptr = Pointer<ffi.Utf8>;

/**
 * FFI 传输核心结构体
 * 映射 C 侧的 QjsResult 结构
 */
final class QjsResult extends Struct {
  @Int32()
  external int type; // 类型

  @Int32()
  external int error; // 是否报错

  @Int64()
  external int i64; // 整数或指针

  @Double()
  external double f64; // 浮点数

  @Uint8()
  external int b; // 布尔

  external Pointer<ffi.Utf8> s; // 字符串或错误消息

  external Pointer<Uint8> data; // 二进制数据

  @Int32()
  external int dataLen; // 二进制数据长度
}

/**
 * Dart 回调处理器签名 (JS 调用 Dart 时进入)
 */
typedef NativeAsyncTypedCallHandler = Void Function(
  Pointer<Void> ctx,
  NativeUtf8Ptr method,
  Pointer<QjsResult> args,
  Int32 argc,
  Pointer<QjsResult> out,
);

/**
 * QuickJS FFI 底层绑定类
 */
final class QuickJsFFI {
  static QuickJsFFI? globalInstance;
  final DynamicLibrary _lib;

  QuickJsFFI(this._lib) {
    globalInstance = this;
  }

  /**
   * 加载动态库 (自动处理平台差异)
   */
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

  // ---------------- FFI 内部绑定 (映射 C 导出函数) ----------------

  late final _create =
      _lib.lookupFunction<Pointer<Void> Function(), Pointer<Void> Function()>(
    'qjs_create_runtime',
  );
  late final _destroy = _lib.lookupFunction<Void Function(Pointer<Void>),
      void Function(Pointer<Void>)>('qjs_destroy_runtime');

  late final _createContext = _lib.lookupFunction<
      Pointer<Void> Function(Pointer<Void>),
      Pointer<Void> Function(Pointer<Void>)>('qjs_create_context');
  late final _destroyContext = _lib.lookupFunction<Void Function(Pointer<Void>),
      void Function(Pointer<Void>)>('qjs_destroy_context');

  late final _evaluateValueOut = _lib.lookupFunction<
      Void Function(
        Pointer<Void>,
        Pointer<Void>,
        Int32,
        Int32,
        Pointer<QjsResult>,
      ),
      void Function(
        Pointer<Void>,
        Pointer<Void>,
        int,
        int,
        Pointer<QjsResult>,
      )>('qjs_evaluate_value_out');

  late final _freeResult = _lib.lookupFunction<
      Void Function(Pointer<QjsResult>),
      void Function(Pointer<QjsResult>)>('qjs_free_result_content');

  late final _freeObject = _lib.lookupFunction<
      Void Function(Pointer<Void>, Pointer<QjsResult>),
      void Function(Pointer<Void>, Pointer<QjsResult>)>('qjs_free_object');

  late final _freeValue = _lib.lookupFunction<
      Void Function(Pointer<Void>, Pointer<QjsResult>),
      void Function(Pointer<Void>, Pointer<QjsResult>)>('qjs_free_value');

  late final _dupContext = _lib.lookupFunction<Void Function(Pointer<Void>),
      void Function(Pointer<Void>)>('qjs_dup_context');

  late final _getGlobal = _lib.lookupFunction<
      Void Function(Pointer<Void>, Pointer<QjsResult>),
      void Function(
          Pointer<Void>, Pointer<QjsResult>)>('qjs_get_global_object');

  late final _setOnEnqueueJob = _lib.lookupFunction<
          Void Function(Pointer<Void>,
              Pointer<NativeFunction<Void Function(Pointer<Void>)>>),
          void Function(Pointer<Void>,
              Pointer<NativeFunction<Void Function(Pointer<Void>)>>)>(
      'qjs_set_on_enqueue_job');

  void setOnEnqueueJob(Pointer<Void> rt,
      Pointer<NativeFunction<Void Function(Pointer<Void>)>> func) {
    _setOnEnqueueJob(rt, func);
  }

  late final _setProperty = _lib.lookupFunction<
      Void Function(
        Pointer<Void>,
        Pointer<QjsResult>,
        Pointer<ffi.Utf8>,
        Pointer<QjsResult>,
      ),
      void Function(
        Pointer<Void>,
        Pointer<QjsResult>,
        Pointer<ffi.Utf8>,
        Pointer<QjsResult>,
      )>('qjs_set_property');

  late final _getProperty = _lib.lookupFunction<
      Void Function(
        Pointer<Void>,
        Pointer<QjsResult>,
        Pointer<ffi.Utf8>,
        Pointer<QjsResult>,
      ),
      void Function(
        Pointer<Void>,
        Pointer<QjsResult>,
        Pointer<ffi.Utf8>,
        Pointer<QjsResult>,
      )>('qjs_get_property');

  late final _newFunction = _lib.lookupFunction<
      Void Function(
        Pointer<Void>,
        Pointer<ffi.Utf8>,
        Pointer<NativeFunction<NativeAsyncTypedCallHandler>>,
        Pointer<QjsResult>,
      ),
      void Function(
        Pointer<Void>,
        Pointer<ffi.Utf8>,
        Pointer<NativeFunction<NativeAsyncTypedCallHandler>>,
        Pointer<QjsResult>,
      )>('qjs_new_function');

  late final _callFunction = _lib.lookupFunction<
      Void Function(
        Pointer<Void>,
        Pointer<QjsResult>,
        Pointer<QjsResult>,
        Int32,
        Pointer<QjsResult>,
      ),
      void Function(
        Pointer<Void>,
        Pointer<QjsResult>,
        Pointer<QjsResult>,
        int,
        Pointer<QjsResult>,
      )>('qjs_call_function');

  late final _invokeMethod = _lib.lookupFunction<
      Void Function(
        Pointer<Void>,
        Pointer<QjsResult>,
        Pointer<ffi.Utf8>,
        Pointer<QjsResult>,
        Int32,
        Pointer<QjsResult>,
      ),
      void Function(
        Pointer<Void>,
        Pointer<QjsResult>,
        Pointer<ffi.Utf8>,
        Pointer<QjsResult>,
        int,
        Pointer<QjsResult>,
      )>('qjs_invoke_method');

  late final _runJobs = _lib.lookupFunction<Int32 Function(Pointer<Void>),
      int Function(Pointer<Void>)>('qjs_run_jobs');

  late final _asyncResolve = _lib.lookupFunction<
      Void Function(Pointer<Void>, Int32, Pointer<QjsResult>),
      void Function(
          Pointer<Void>, int, Pointer<QjsResult>)>('qjs_async_resolve_typed');

  late final _asyncReject = _lib.lookupFunction<
      Void Function(Pointer<Void>, Int32, Pointer<ffi.Utf8>),
      void Function(Pointer<Void>, int, Pointer<ffi.Utf8>)>('qjs_async_reject');

  late final _setUseBinaryProtocol =
      _lib.lookupFunction<Void Function(Int32), void Function(int)>(
    'qjs_set_use_binary_protocol',
  );

  late final _initDefaultBindings = _lib.lookupFunction<
      Void Function(Pointer<Void>),
      void Function(Pointer<Void>)>('qjs_init_default_bindings');

  // ---------------- 业务封装接口 ----------------

  Pointer<Void> createRuntime() => _create();
  void destroyRuntime(Pointer<Void> h) => _destroy(h);

  Pointer<Void> createContext(Pointer<Void> rtHandle) =>
      _createContext(rtHandle);
  void destroyContext(Pointer<Void> ctxHandle) => _destroyContext(ctxHandle);

  void initDefaultBindings(Pointer<Void> ctxHandle) =>
      _initDefaultBindings(ctxHandle);

  Pointer<QjsResult> getGlobalObject(Pointer<Void> ctxHandle) {
    final out = ffi.calloc<QjsResult>();
    _getGlobal(ctxHandle, out);
    return out;
  }

  void setProperty(
    Pointer<Void> ctxHandle,
    Pointer<QjsResult> obj,
    String prop,
    Pointer<QjsResult> val,
  ) {
    final cprop = prop.toNativeUtf8();
    _setProperty(ctxHandle, obj, cprop, val);
    ffi.malloc.free(cprop);
  }

  Pointer<QjsResult> getProperty(
    Pointer<Void> ctxHandle,
    Pointer<QjsResult> obj,
    String prop,
  ) {
    final cstr = prop.toNativeUtf8();
    final out = ffi.calloc<QjsResult>();
    _getProperty(ctxHandle, obj, cstr, out);
    ffi.malloc.free(cstr);
    return out;
  }

  Pointer<QjsResult> newFunction(
    Pointer<Void> ctxHandle,
    String name,
    Pointer<NativeFunction<NativeAsyncTypedCallHandler>> cb,
  ) {
    final cname = name.toNativeUtf8();
    final out = ffi.calloc<QjsResult>();
    _newFunction(ctxHandle, cname, cb, out);
    ffi.malloc.free(cname);
    return out;
  }

  dynamic callFunction(
    Pointer<Void> ctxHandle,
    Pointer<QjsResult> obj,
    List<dynamic> args,
  ) {
    final out = ffi.calloc<QjsResult>();
    final cargs = ffi.calloc<QjsResult>(args.length);
    for (var i = 0; i < args.length; i++) {
      QuickJsFFI.writeOut(cargs + i, args[i]);
    }

    _callFunction(ctxHandle, obj, cargs, args.length, out);

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
    if (out.ref.type == qjsTypeObject || out.ref.type == qjsTypeFunction) {
      _freeValue(ctxHandle, out);
    }
    _freeResult(out);
    ffi.calloc.free(out);
    return res;
  }

  dynamic invokeMethod(
    Pointer<Void> ctxHandle,
    Pointer<QjsResult> obj,
    String name,
    List<dynamic> args,
  ) {
    final cname = name.toNativeUtf8();
    final out = ffi.calloc<QjsResult>();
    final cargs = ffi.calloc<QjsResult>(args.length);
    for (var i = 0; i < args.length; i++) {
      QuickJsFFI.writeOut(cargs + i, args[i]);
    }

    _invokeMethod(ctxHandle, obj, cname, cargs, args.length, out);

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
    if (out.ref.type == qjsTypeObject || out.ref.type == qjsTypeFunction) {
      _freeValue(ctxHandle, out);
    }
    _freeResult(out);
    ffi.calloc.free(out);
    return res;
  }

  dynamic eval(Pointer<Void> ctxHandle, String code) {
    final cstr = code.toNativeUtf8();
    final out = ffi.calloc<QjsResult>();
    _evaluateValueOut(ctxHandle, cstr.cast(), cstr.length, 0, out);
    ffi.malloc.free(cstr);

    if (out.ref.error != 0) {
      final msg =
          out.ref.s.address == 0 ? 'Unknown error' : out.ref.s.toDartString();
      _freeResult(out);
      ffi.calloc.free(out);
      throw Exception(msg);
    }

    final res = convertQjsResultToDart(out.ref);
    if (out.ref.type == qjsTypeObject || out.ref.type == qjsTypeFunction) {
      _freeValue(ctxHandle, out);
    }
    _freeResult(out);
    ffi.calloc.free(out);
    return res;
  }

  dynamic evalWithBinary(Pointer<Void> ctxHandle, Uint8List bytecode) {
    final ptr = ffi.malloc<Uint8>(bytecode.length);
    ptr.asTypedList(bytecode.length).setAll(0, bytecode);
    final out = ffi.calloc<QjsResult>();
    _evaluateValueOut(ctxHandle, ptr.cast(), bytecode.length, 1, out);
    ffi.malloc.free(ptr);

    if (out.ref.error != 0) {
      final msg =
          out.ref.s.address == 0 ? 'Unknown error' : out.ref.s.toDartString();
      _freeResult(out);
      ffi.calloc.free(out);
      throw Exception(msg);
    }

    final res = convertQjsResultToDart(out.ref);
    if (out.ref.type == qjsTypeObject || out.ref.type == qjsTypeFunction) {
      _freeValue(ctxHandle, out);
    }
    _freeResult(out);
    ffi.calloc.free(out);
    return res;
  }

  void freeQjsResult(Pointer<QjsResult> p) {
    _freeResult(p);
    ffi.calloc.free(p);
  }

  void freeObject(Pointer<Void> ctxHandle, Pointer<QjsResult> obj) {
    _freeObject(ctxHandle, obj);
  }

  void freeValue(Pointer<Void> ctxHandle, Pointer<QjsResult> obj) {
    _freeValue(ctxHandle, obj);
  }

  void contextIncref(Pointer<Void> ctxHandle) {
    _dupContext(ctxHandle);
  }

  static bool _useBinaryProtocol = true;

  void setUseBinaryProtocol(bool use) {
    _useBinaryProtocol = use;
    _setUseBinaryProtocol(use ? 1 : 0);
  }

  /**
   * 将 FFI 的 QjsResult 转换为 Dart 对象
   */
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

        // 自动探测协议：如果第一个字节不是有效的二进制标签 (0-6)，则尝试 JSON 解析
        bool isBinary = false;
        if (bytes.isNotEmpty) {
          final firstByte = bytes[0];
          if (firstByte >= _binaryTagNull && firstByte <= _binaryTagMap) {
            isBinary = true;
          }
        }

        if (isBinary && _useBinaryProtocol) {
          // 使用二进制协议反序列化
          try {
            final reader = _BinaryReader(bytes);
            return reader.read();
          } catch (e) {
            debugPrint('二进制解析失败，尝试 JSON: $e');
            // 回退到 JSON 尝试
          }
        }

        // 使用 JSON 解析
        try {
          final jsonStr = utf8.decode(bytes);
          return json.decode(jsonStr);
        } catch (e) {
          debugPrint('JSON 解析失败: $e');
          return null;
        }
      default:
        return null;
    }
  }

  /**
   * 将 Dart 对象写入 QjsResult (准备传给 C 侧)
   */
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
      // 其他复杂类型根据协议选择序列化方式
      out.ref.type = qjsTypeObject;
      if (_useBinaryProtocol) {
        final writer = _BinaryWriter();
        writer.write(v);
        final bytes = writer.takeBytes();
        final ptr = ffi.malloc<Uint8>(bytes.length);
        ptr.asTypedList(bytes.length).setAll(0, bytes);
        out.ref.data = ptr;
        out.ref.dataLen = bytes.length;
      } else {
        final jsonStr = json.encode(v);
        final bytes = utf8.encode(jsonStr);
        final ptr = ffi.malloc<Uint8>(bytes.length);
        ptr.asTypedList(bytes.length).setAll(0, bytes);
        out.ref.data = ptr;
        out.ref.dataLen = bytes.length;
      }
    }
  }

  /**
   * 驱动 JS 任务循环
   * 该方法负责：
   * 1. 将 Dart 完成的异步 Future 结果同步回 JS Promise。
   * 2. 执行 QuickJS 内部的任务队列 (微任务、Promise 链等)。
   */
  static final Set<int> _busyRuntimes = {};

  int runJobs(Pointer<Void> rtHandle, Pointer<Void> ctxHandle) {
    // Prevent recursion: if this runtime is already running jobs, skip
    if (_busyRuntimes.contains(rtHandle.address)) {
      return 0;
    }
    _busyRuntimes.add(rtHandle.address);
    try {
      int totalExecuted = 0;
      bool hasMore;
      do {
        hasMore = false;

        // 1. 处理挂起的异步 Promise (Resolvers)
        final ctxAddr = ctxHandle.address;
        if (ctxAddr != 0) {
          final resolvers = JSObject.pendingResolvers[ctxAddr];
          if (resolvers != null && resolvers.isNotEmpty) {
            final ids = resolvers.keys.toList();
            for (final id in ids) {
              final val = resolvers.remove(id);
              final out = ffi.calloc<QjsResult>();
              QuickJsFFI.writeOut(out, val);
              _asyncResolve(ctxHandle, id, out);
              freeQjsResult(out);
              hasMore = true;
            }
          }

          // 2. 处理挂起的异步 Promise (Rejections)
          final rejections = JSObject.pendingRejections[ctxAddr];
          if (rejections != null && rejections.isNotEmpty) {
            final ids = rejections.keys.toList();
            for (final id in ids) {
              final reason = rejections.remove(id) ?? 'Unknown error';
              final cstr = reason.toNativeUtf8();
              _asyncReject(ctxHandle, id, cstr);
              ffi.malloc.free(cstr);
              hasMore = true;
            }
          }
        }

        // 3. 执行 QuickJS 自身的任务队列
        if (_runJobs(rtHandle) > 0) {
          hasMore = true;
        }

        if (hasMore) totalExecuted++;
      } while (hasMore);

      return totalExecuted;
    } finally {
      _busyRuntimes.remove(rtHandle.address);
    }
  }
}

/**
 * 二进制协议写入器
 */
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
      _builder.add(
        (ByteData(8)..setInt64(0, v, Endian.host)).buffer.asUint8List(),
      );
    } else if (v is double) {
      _builder.addByte(_binaryTagFloat64);
      _builder.add(
        (ByteData(8)..setFloat64(0, v, Endian.host)).buffer.asUint8List(),
      );
    } else if (v is String) {
      _builder.addByte(_binaryTagString);
      final b = utf8.encode(v);
      _builder.add(
        (ByteData(4)..setUint32(0, b.length, Endian.host)).buffer.asUint8List(),
      );
      _builder.add(b);
    } else if (v is List) {
      _builder.addByte(_binaryTagList);
      _builder.add(
        (ByteData(4)..setUint32(0, v.length, Endian.host)).buffer.asUint8List(),
      );
      for (var e in v) write(e);
    } else if (v is Map) {
      _builder.addByte(_binaryTagMap);
      _builder.add(
        (ByteData(4)..setUint32(0, v.length, Endian.host)).buffer.asUint8List(),
      );
      v.forEach((k, value) {
        write(k.toString());
        write(value);
      });
    }
  }

  Uint8List takeBytes() => _builder.takeBytes();
}

/**
 * 二进制协议读取器
 */
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
        final v = ByteData.sublistView(
          _bytes,
          _offset,
          _offset + 8,
        ).getInt64(0, Endian.host);
        _offset += 8;
        return v;
      case _binaryTagFloat64:
        final v = ByteData.sublistView(
          _bytes,
          _offset,
          _offset + 8,
        ).getFloat64(0, Endian.host);
        _offset += 8;
        return v;
      case _binaryTagString:
        final len = ByteData.sublistView(
          _bytes,
          _offset,
          _offset + 4,
        ).getUint32(0, Endian.host);
        _offset += 4;
        final s = utf8.decode(_bytes.sublist(_offset, _offset + len));
        _offset += len;
        return s;
      case _binaryTagList:
        final len = ByteData.sublistView(
          _bytes,
          _offset,
          _offset + 4,
        ).getUint32(0, Endian.host);
        _offset += 4;
        final list = [];
        for (var i = 0; i < len; i++) {
          list.add(read());
        }
        return list;
      case _binaryTagMap:
        final len = ByteData.sublistView(
          _bytes,
          _offset,
          _offset + 4,
        ).getUint32(0, Endian.host);
        _offset += 4;
        final map = {};
        for (var i = 0; i < len; i++) {
          final key = read();
          final val = read();
          map[key] = val;
        }
        return map;
      default:
        return null;
    }
  }
}
