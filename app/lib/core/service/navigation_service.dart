import 'BaseFuickService.dart';

class NavigationService extends BaseFuickService {
  NavigationService() {
    registerMethod('push', (args) {
      final m = args is Map
          ? Map<String, dynamic>.from(args)
          : <String, dynamic>{};
      final path = (m['path'] ?? '') as String;
      final params = m['params'] ?? {};
      if (path.isNotEmpty) {
        controller?.pushWithPath(path, Map<String, dynamic>.from(params));
      }
      return true;
    });

    registerMethod('pop', (args) {
      controller?.pop();
      return true;
    });
  }
}
