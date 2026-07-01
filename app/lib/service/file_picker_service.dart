import 'package:file_picker/file_picker.dart';
import 'package:fuickjs_flutter/core/service/base_fuick_service.dart';

/// FuickJS 文件/目录选择服务
///
/// 依赖：`file_picker: ^8.1.4`
class FilePickerService extends BaseFuickService {
  @override
  String get name => 'FilePicker';

  FilePickerService() {
    registerAsyncMethod('pickDirectory', _pickDirectory);
    registerAsyncMethod('pickFiles', _pickFiles);
    registerAsyncMethod('saveFile', _saveFile);
  }

  Future<String?> _pickDirectory(dynamic args) async {
    final Map params = args is Map ? args : {};
    final String? initialDir = params['initialDirectory']?.toString();
    try {
      final result = await FilePicker.platform.getDirectoryPath(
        initialDirectory: initialDir,
      );
      return result;
    } catch (_) {
      return null;
    }
  }

  Future<Map<String, dynamic>> _pickFiles(dynamic args) async {
    final Map params = args is Map ? args : {};
    final bool allowMultiple = params['allowMultiple'] == true;
    final String? typeStr = params['type']?.toString();
    final List<String>? extensions = (params['extensions'] is List)
        ? (params['extensions'] as List).map((e) => e.toString()).toList()
        : null;

    FileType type = FileType.any;
    if (typeStr == 'image') type = FileType.image;
    if (typeStr == 'video') type = FileType.video;
    if (typeStr == 'audio') type = FileType.audio;
    if (typeStr == 'media') type = FileType.media;
    if (typeStr == 'custom') type = FileType.custom;

    try {
      final result = await FilePicker.platform.pickFiles(
        allowMultiple: allowMultiple,
        type: type,
        allowedExtensions: extensions,
        withData: false,
      );
      if (result == null) return {'canceled': true, 'paths': []};
      final paths =
          result.files.map((f) => f.path).whereType<String>().toList();
      return {'canceled': false, 'paths': paths};
    } catch (_) {
      return {'canceled': true, 'paths': []};
    }
  }

  Future<String?> _saveFile(dynamic args) async {
    final Map params = args is Map ? args : {};
    final String? fileName = params['fileName']?.toString();
    final String? dialogTitle = params['dialogTitle']?.toString();
    try {
      final result = await FilePicker.platform.saveFile(
        fileName: fileName,
        dialogTitle: dialogTitle,
      );
      return result;
    } catch (_) {
      return null;
    }
  }
}
