import 'package:flutter/foundation.dart';
import 'BaseFuickService.dart';

class ConsoleService extends BaseFuickService {
  ConsoleService() {
    registerMethod('console', (args) {
      final m = args is Map ? args : {};
      final level = m['level'] ?? 'log';
      final message = m['message'] ?? '';
      debugPrint('[JS $level] $message');
      return null;
    });
  }
}
