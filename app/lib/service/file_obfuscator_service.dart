import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'dart:math';

import 'package:path/path.dart' as p;
import 'package:fuickjs_flutter/core/service/base_fuick_service.dart';

/// Demo App 专用：文件破坏/还原工具
///
/// 算法：原地替换文件 pos=0..15 的 16 字节（覆盖文件头，让常见媒体格式无法识别）
/// - destroy: 读取原始 16 字节 → 保存到 .obfuscate_bak/{uuid} → 写入破坏标记到原文件
/// - restore: 从 .obfuscate_bak/{uuid} 读取 → 校验破坏标记 → 写回原文件 pos=0..15
///
/// 破坏标记：固定 16 字节 "OBFS_CLR_DESTROY"，自然文件在 pos=0..15 出现该完整序列
/// 的概率 ≈ 1/256^16 ≈ 10^-39，配合 .obfuscate_bak/manifest.json 双重保证识别准确。
///
/// 文件头被改后效果：
/// - JPEG: SOI (0xFFD8) → 所有解析器拒识
/// - PNG: 8 字节签名 → 签名损坏
/// - MP4: box size + 'ftyp' → 容器识别失败
/// - MP3: ID3v2 header / frame sync → 解析失败
///
/// 备份文件（16 字节）和映射表统一存在 .obfuscate_bak 目录，扫描时自动忽略。
class FileObfuscatorService extends BaseFuickService {
  @override
  String get name => 'FileObfuscator';

  static const int _insertPos = 0;
  static const int _insertLen = 16;

  // 16 字节破坏标记：ASCII "OBFS_CLR_DESTROY"
  static const List<int> _destroyMagic = <int>[
    0x4F, 0x42, 0x46, 0x53, // OBFS
    0x5F, 0x43, 0x4C, 0x52, // _CLR
    0x5F, 0x44, 0x45, 0x53, // _DES
    0x54, 0x52, 0x4F, 0x59, // TROY
  ];
  static final Uint8List _destroyMagicBytes = Uint8List.fromList(_destroyMagic);

  // 统一备份目录名（以 . 开头，扫描时忽略） 
  static const String _bakDirName = '.obfuscate_bak';
  static const String _manifestFileName = 'manifest.json';

  FileObfuscatorService() {
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

  // 安全模式：
  // - destroy: 备份 16 字节 → 统一 .obfuscate_bak/{uuid} → 写入破坏标记到原文件
  // - restore: 从 .obfuscate_bak/{uuid} 读 16 字节 → 校验破坏标记 → 写回原文件
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
        // 读取原文件 pos=0..15 的 16 字节
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
          await _writeRange(file, _insertPos, _destroyMagicBytes);
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
                  '源文件破坏且回滚失败，请手动用 .obfuscate_bak/$uuid 恢复 pos=0..15: ${e2.toString()}',
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
              'error': 'pos=0..15 不是破坏标记，且无备份记录，无法还原',
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

        // 校验原文件 pos=0..15 是否仍是破坏标记
        final currentData = await _readRange(file, _insertPos, _insertLen);
        if (currentData.length != _insertLen) {
          return {
            'ok': false,
            'error': 'pos=0..15 长度异常',
          };
        }
        for (int i = 0; i < _insertLen; i++) {
          if (currentData[i] != _destroyMagic[i]) {
            return {
              'ok': false,
              'error': 'pos=0..15 不是破坏标记，可能已被修改过',
            };
          }
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
      // 以 manifest 记录为准：存在记录 ⇒ 一定被本工具破坏
      // final manifest = _loadManifest(path);
      // if (manifest.containsKey(p.basename(path))) {
      //   return {
      //     'ok': true,
      //     'size': len,
      //     'isDestroyed': true,
      //     'isRestorable': true,
      //   };
      // }
      // 无 manifest 记录时，用破坏标记检查（自然文件几乎不可能匹配）
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

  // 检查文件 pos=0..15 是否为本工具的破坏标记
  Future<bool> _checkDestroyed(File file) async {
    final raf = await file.open(mode: FileMode.read);
    try {
      await raf.setPosition(_insertPos);
      final bytes = await raf.read(_insertLen);
      if (bytes.length != _insertLen) return false;
      for (int i = 0; i < _insertLen; i++) {
        if (bytes[i] != _destroyMagic[i]) return false;
      }
      return true;
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
