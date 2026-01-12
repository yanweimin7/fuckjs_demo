import '../widgets/widget_factory.dart';
import 'BaseFuickService.dart';

class UIService extends BaseFuickService {
  UIService() {
    registerMethod('renderUI', (args) {
      final List listArgs = args is List ? args : [args];
      if (listArgs.length == 1 && listArgs[0] is Map) {
        final m = listArgs[0] as Map;
        final pageId = (m['pageId'] as num?)?.toInt();
        final renderData = (m['renderData'] as Map?)?.cast<String, dynamic>() ??
            const <String, dynamic>{};
        if (pageId != null) {
          controller?.render(pageId, renderData);
          return true;
        }
      }
      return false;
    });

    registerMethod('patchUI', (args) {
      final List listArgs = args is List ? args : [args];
      if (listArgs.length == 1 && listArgs[0] is Map) {
        final m = listArgs[0] as Map;
        final pageId = (m['pageId'] as num?)?.toInt();
        final patches = (m['patches'] as List?) ?? [];
        if (pageId != null) {
          controller?.patch(pageId, patches);
          return true;
        }
      }
      return false;
    });

    registerMethod('componentCommand', (args) {
      final List listArgs = args is List ? args : [args];
      if (listArgs.length == 1 && listArgs[0] is Map) {
        final m = listArgs[0] as Map;
        final refId = m['refId']?.toString();
        final method = m['method']?.toString();
        final commandArgs = m['args'];
        final nodeType = m['nodeType']?.toString();

        if (refId != null && method != null && nodeType != null) {
          WidgetFactory().dispatchCommand(nodeType, refId, method, commandArgs);
          return true;
        }
      }
      return false;
    });
  }
}
