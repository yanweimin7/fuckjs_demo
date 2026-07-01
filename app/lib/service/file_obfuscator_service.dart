import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'dart:math';

import 'package:path/path.dart' as p;
import 'package:fuickjs_flutter/core/service/base_fuick_service.dart';

/// Demo App 专用：文件破坏/还原工具
///
/// 算法：原地替换文件 pos=20..35 的 16 字节
/// - destroy: 读取原始 16 字节 → 保存到 .obfuscate_bak/{uuid} → 写 0x00 到原文件
/// - restore: 从 .obfuscate_bak/{uuid} 读取 → 写回原文件 pos=20..35
///
/// 备份文件（16 字节）和映射表统一存在 .obfuscate_bak 目录，扫描时自动忽略。
class FileObfuscatorService extends BaseFuickService {
  @override
  String get name => 'FileObfuscator';

  static const int _insertPos = 20;
  static const int _insertLen = 16;

  // 统一备份目录名（以 . 开头，扫描时忽略）
  static const String _bakDirName = '.obfuscate_bak';
  static const String _manifestFileName = 'manifest.json';

  FileObfuscatorService() {
    registerAsyncMethod('obfuscateFile', _obfuscateFile);
    registerAsyncMethod('obfuscateFileSafe', _obfuscateFileSafe);
    registerAsyncMethod('inspectFile', _inspectFile);
    registerAsyncMethod('cleanupTempFiles', _cleanupTempFiles);
  }

  String? _getPath(dynamic args) {
    if (args is String) return args;
    if (args is Map) return args['path']?.toString();
    return null;
  }

  String? _getDir(dynamic args) {
    if (args is Map) return args['dir']?.toString();
    return null;
  }

  // 获取备份目录路径
  String _getBakDir(String filePath) {
    return p.join(p.dirname(filePath), _bakDirName);
  }

  // 获取 manifest.json 路径
  String _getManifestPath(String filePath) {
    return p.join(_getBakDir(filePath), _manifestFileName);
  }

  // 生成 UUID v4
  String _generateUuid() {
    final random = Random.secure();
    final bytes = List<int>.generate(16, (_) => random.nextInt(256));
    // Set version (4) and variant (RFC 4122)
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    final hex = bytes.map((b) => b.toRadixString(16).padLeft(2, '0')).join();
    return '${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20, 32)}';
  }

  // 读取映射表
  Map<String, dynamic> _loadManifest(String filePath) {
    final manifestPath = _getManifestPath(filePath);
    final manifestFile = File(manifestPath);
    if (!manifestFile.existsSync()) {
      return {};
    }
    try {
      final content = manifestFile.readAsStringSync();
      return jsonDecode(content) as Map<String, dynamic>;
    } catch (e) {
      return {};
    }
  }

  // 保存映射表
  void _saveManifest(String filePath, Map<String, dynamic> manifest) {
    final bakDir = _getBakDir(filePath);
    final dir = Directory(bakDir);
    if (!dir.existsSync()) {
      dir.createSync(recursive: true);
    }
    final manifestPath = _getManifestPath(filePath);
    File(manifestPath).writeAsStringSync(jsonEncode(manifest));
  }

  // 读文件的指定范围
  Future<Uint8List> _readRange(File file, int pos, int len) async {
    final raf = await file.open(mode: FileMode.read);
    try {
      await raf.setPosition(pos);
      return await raf.read(len);
    } finally {
      await raf.close();
    }
  }

  // 原地写文件的指定范围
  // FileMode.write 和 FileMode.writeOnly 都会截断文件！
  // FileMode.append 不截断，配合 setPosition 可以写中间位置
  Future<void> _writeRange(File file, int pos, Uint8List data) async {
    final raf = await file.open(mode: FileMode.append);
    try {
      await raf.setPosition(pos);
      await raf.writeFrom(data);
      await raf.flush();
    } finally {
      await raf.close();
    }
  }

  // 普通模式：readAsBytes → 改 → writeAsBytes（仅适合小文件）
  Future<Map<String, dynamic>> _obfuscateFile(dynamic args) async {
    final path = _getPath(args);
    if (path == null) return {'ok': false, 'error': 'missing path'};
    final Map argsMap = args is Map ? args : {};
    final String mode = (argsMap['mode'] as String?) ?? 'destroy';

    try {
      final file = File(path);
      if (!await file.exists()) {
        return {'ok': false, 'error': 'file not found'};
      }
      final bytes = await file.readAsBytes();

      late Uint8List out;
      if (mode == 'destroy') {
        if (bytes.length < _insertPos) {
          out = Uint8List(bytes.length + _insertLen);
          for (int i = 0; i < bytes.length; i++) {
            out[i] = bytes[i];
          }
        } else {
          out = Uint8List(bytes.length + _insertLen);
          out.setRange(0, _insertPos, bytes);
          out.setRange(
              _insertPos + _insertLen, out.length, bytes.sublist(_insertPos));
        }
      } else {
        if (bytes.length < _insertPos + _insertLen) {
          return {
            'ok': false,
            'error': '文件长度 ${bytes.length} < ${_insertPos + _insertLen}，无法还原',
          };
        }
        int zeroCount = 0;
        for (int i = _insertPos; i < _insertPos + _insertLen; i++) {
          if (bytes[i] == 0) zeroCount++;
        }
        if (zeroCount < _insertLen ~/ 2) {
          return {
            'ok': false,
            'error': 'pos=20..35 不是零字节，可能未经过破坏处理',
          };
        }
        out = Uint8List(bytes.length - _insertLen);
        out.setRange(0, _insertPos, bytes);
        out.setRange(
            _insertPos, out.length, bytes.sublist(_insertPos + _insertLen));
      }

      await file.writeAsBytes(out, flush: true);
      return {
        'ok': true,
        'size': out.length,
        'origSize': bytes.length,
      };
    } catch (e) {
      return {'ok': false, 'error': e.toString()};
    }
  }

  // 安全模式：
  // - destroy: 备份 16 字节 → 统一 .obfuscate_bak/{uuid} → 写 0 到原文件
  // - restore: 从 .obfuscate_bak/{uuid} 读 16 字节 → 写回原文件
  Future<Map<String, dynamic>> _obfuscateFileSafe(dynamic args) async {
    final path = _getPath(args);
    if (path == null) return {'ok': false, 'error': 'missing path'};
    final Map argsMap = args is Map ? args : {};
    final String mode = (argsMap['mode'] as String?) ?? 'destroy';

    try {
      final file = File(path);
      if (!await file.exists()) {
        return {'ok': false, 'error': 'file not found'};
      }
      final origSize = await file.length();

      // 文件必须 >= 36 字节
      if (origSize < _insertPos + _insertLen) {
        return {
          'ok': false,
          'error': '文件太小（$origSize < ${_insertPos + _insertLen}），无法处理',
        };
      }

      // 获取备份目录和映射表
      final bakDir = _getBakDir(path);
      final manifest = _loadManifest(path);

      if (mode == 'destroy') {
        // 读取原文件 pos=20..35 的 16 字节
        final backupData = await _readRange(file, _insertPos, _insertLen);

        // 生成 UUID 作为备份文件名
        final uuid = _generateUuid();
        final bakFilePath = p.join(bakDir, uuid);
        final bakFile = File(bakFilePath);

        // 创建备份目录（如不存在）
        final dir = Directory(bakDir);
        if (!dir.existsSync()) {
          dir.createSync(recursive: true);
        }

        // 写备份文件（16 字节）
        await bakFile.writeAsBytes(backupData, flush: true);

        // 更新映射表：文件名 → uuid（manifest 在 .obfuscate_bak/ 下，key 用文件名即可）
        manifest[p.basename(path)] = {
          'uuid': uuid,
          'createdAt': DateTime.now().toIso8601String(),
        };
        _saveManifest(path, manifest);

        // 破坏原文件
        try {
          await _writeRange(file, _insertPos, Uint8List(_insertLen));
          return {
            'ok': true,
            'size': origSize,
            'origSize': origSize,
          };
        } catch (e) {
          // 破坏失败：尝试回滚
          try {
            await _writeRange(file, _insertPos, backupData);
            // 回滚成功：删除备份文件，移除映射
            try {
              await bakFile.delete();
            } catch (_) {}
            manifest.remove(p.basename(path));
            _saveManifest(path, manifest);
            return {
              'ok': false,
              'error': '已自动回滚源文件，错误: ${e.toString()}',
            };
          } catch (e2) {
            // 回滚失败：保留备份和映射，用户可手动恢复
            return {
              'ok': false,
              'error':
                  '源文件破坏且回滚失败，请手动用 .obfuscate_bak/$uuid 恢复 pos=20..35: ${e2.toString()}',
            };
          }
        }
      } else {
        // restore 模式：查映射表找到 uuid（key 用文件名）
        final entry = manifest[p.basename(path)] as Map<String, dynamic>?;
        if (entry == null || entry['uuid'] == null) {
          // 没有映射，检查文件是否处于破坏状态
          final isDestroyed = await _checkDestroyed(file);
          if (!isDestroyed) {
            return {
              'ok': false,
              'error': 'pos=20..35 不是零字节，且无备份记录，无法还原',
            };
          }
          return {
            'ok': false,
            'error': '未找到备份记录，无法还原',
          };
        }

        final uuid = entry['uuid'] as String;
        final bakFilePath = p.join(bakDir, uuid);
        final bakFile = File(bakFilePath);

        if (!await bakFile.exists()) {
          return {
            'ok': false,
            'error': '备份文件 .obfuscate_bak/$uuid 不存在，无法还原',
          };
        }

        // 读取备份的 16 字节
        final originalData = await bakFile.readAsBytes();
        if (originalData.length != _insertLen) {
          return {
            'ok': false,
            'error': '备份文件大小异常（${originalData.length}）',
          };
        }

        // 校验原文件 pos=20..35 是否为 0
        final currentData = await _readRange(file, _insertPos, _insertLen);
        int zeroCount = 0;
        for (int i = 0; i < currentData.length; i++) {
          if (currentData[i] == 0) zeroCount++;
        }
        if (zeroCount < _insertLen ~/ 2) {
          return {
            'ok': false,
            'error': 'pos=20..35 不是零字节，可能已被修改过',
          };
        }

        // 恢复原文件
        try {
          await _writeRange(file, _insertPos, originalData);
          return {
            'ok': true,
            'size': origSize,
            'origSize': origSize,
          };
        } catch (e) {
          return {
            'ok': false,
            'error': '恢复文件失败: ${e.toString()}',
          };
        }
      }
    } catch (e) {
      return {'ok': false, 'error': e.toString()};
    }
  }

  // 检查文件状态
  Future<Map<String, dynamic>> _inspectFile(dynamic args) async {
    final path = _getPath(args);
    if (path == null) return {'ok': false, 'error': 'missing path'};
    try {
      final file = File(path);
      if (!await file.exists()) {
        return {'ok': false, 'error': 'file not found'};
      }
      final len = await file.length();
      if (len < _insertPos + _insertLen) {
        return {
          'ok': true,
          'size': len,
          'isDestroyed': false,
          'isRestorable': false,
        };
      }
      final isDestroyed = await _checkDestroyed(file);
      return {
        'ok': true,
        'size': len,
        'isDestroyed': isDestroyed,
        'isRestorable': isDestroyed,
      };
    } catch (e) {
      return {'ok': false, 'error': e.toString()};
    }
  }

  Future<bool> _checkDestroyed(File file) async {
    final raf = await file.open(mode: FileMode.read);
    try {
      await raf.setPosition(_insertPos);
      final bytes = await raf.read(_insertLen);
      int zeroCount = 0;
      for (int i = 0; i < bytes.length; i++) {
        if (bytes[i] == 0) zeroCount++;
      }
      return zeroCount >= _insertLen ~/ 2;
    } finally {
      await raf.close();
    }
  }

  // 清理指定目录下残留的 .obfuscate_bak 目录
  Future<Map<String, dynamic>> _cleanupTempFiles(dynamic args) async {
    final dirPath = _getDir(args);
    if (dirPath == null) return {'ok': false, 'error': 'missing dir'};
    try {
      final bakDir = Directory(p.join(dirPath, _bakDirName));
      if (!bakDir.existsSync()) return {'ok': true, 'removed': 0};
      int removed = 0;
      await for (final entity in bakDir.list()) {
        try {
          await entity.delete();
          removed++;
        } catch (_) {}
      }
      return {'ok': true, 'removed': removed};
    } catch (e) {
      return {'ok': false, 'error': e.toString()};
    }
  }
}
