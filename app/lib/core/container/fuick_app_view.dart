import 'package:flutter/cupertino.dart';
import 'package:flutter/services.dart';
import 'package:flutter_quickjs/quickjs_ffi.dart';

import '../engine/engine.dart';
import '../handler/js_handler_manager.dart';
import 'fuick_app_controller.dart';
import 'fuick_page_view.dart';

class FuickAppView extends StatefulWidget {
  const FuickAppView({super.key});

  @override
  State<FuickAppView> createState() => _FuickAppViewState();
}

class _FuickAppViewState extends State<FuickAppView> {
  late QuickJsContext ctx;
  late FuickAppController _uiController;
  late int pageId = nextPageId;
  bool _canInnerPop = false;

  late final NavigatorObserver _observer = _FuickNavigatorObserver(() {
    if (mounted) {
      final canPop = _uiController.navKey.currentState?.canPop() ?? false;
      if (canPop != _canInnerPop) {
        setState(() {
          _canInnerPop = canPop;
        });
      }
    }
  });

  @override
  void initState() {
    super.initState();
    if (Engine.runtime == null) {
      Engine.initQjs();
    }
    ctx = Engine.runtime!.createContext();
    _uiController = FuickAppController(ctx);
    JsHandlerManager.registerHandlers(ctx, _uiController);
    _loadBundle();
  }

  Future<void> _loadBundle() async {
    try {
      final bundle = await rootBundle.loadString('assets/js/bundle.js');
      ctx.eval(bundle);
      _uiController.isBundleLoaded.value = true;
    } catch (e) {
      debugPrint('加载 React bundle 失败: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: !_canInnerPop,
      onPopInvokedWithResult: (bool didPop, dynamic result) async {
        if (didPop) return;
        final NavigatorState? nav = _uiController.navKey.currentState;
        if (nav != null && nav.canPop()) {
          nav.pop();
        }
      },
      child: Navigator(
        key: _uiController.navKey,
        observers: [_observer],
        onGenerateInitialRoutes: (NavigatorState nav, String initialRoute) {
          return [
            CupertinoPageRoute(
              builder: (_) => FuickPageView(
                pageId: pageId,
                controller: _uiController,
                routeInfo: RouteInfo('/', {}),
              ),
            ),
          ];
        },
      ),
    );
  }

  @override
  void dispose() {
    ///延迟关闭，确保js端完成清理任务
    Future.delayed(const Duration(seconds: 30), () {
      ctx.dispose();
    });
    super.dispose();
  }
}

class _FuickNavigatorObserver extends NavigatorObserver {
  final VoidCallback onStateChanged;

  _FuickNavigatorObserver(this.onStateChanged);

  @override
  void didPush(Route<dynamic> route, Route<dynamic>? previousRoute) {
    super.didPush(route, previousRoute);
    onStateChanged();
  }

  @override
  void didPop(Route<dynamic> route, Route<dynamic>? previousRoute) {
    super.didPop(route, previousRoute);
    onStateChanged();
  }

  @override
  void didRemove(Route<dynamic> route, Route<dynamic>? previousRoute) {
    super.didRemove(route, previousRoute);
    onStateChanged();
  }

  @override
  void didReplace({Route<dynamic>? newRoute, Route<dynamic>? oldRoute}) {
    super.didReplace(newRoute: newRoute, oldRoute: oldRoute);
    onStateChanged();
  }
}
