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
    if (Engine.qjs == null) {
      Engine.initQjs();
    }
    // 使用 Engine 中共享的 runtime，每个 AppView 拥有独立的 context
    ctx = Engine.runtime!.createContext();
    _uiController = FuickAppController(ctx);
    JsHandlerManager.registerHandlers(ctx, _uiController);
    _loadBundle();
  }

  Future<void> _loadBundle() async {
    try {
      // 优先加载二进制字节码
      try {
        final ByteData data = await rootBundle.load('assets/js/bundle.qjc');
        final Uint8List bytes = data.buffer.asUint8List(
          data.offsetInBytes,
          data.lengthInBytes,
        );
        ctx.evalBinary(bytes);
        debugPrint('成功加载 QuickJS 字节码 bundle');
        // final bundle = await rootBundle.loadString('assets/js/bundle.js');
        // ctx.eval(bundle);
      } catch (e) {
        debugPrint('加载字节码 bundle 失败，尝试加载文本 bundle: $e');
        final bundle = await rootBundle.loadString('assets/js/bundle.js');
        ctx.eval(bundle);
        debugPrint('成功加载文本 bundle');
      }

      // 执行任务队列，确保 initApp 等异步逻辑执行完毕
      ctx.runJobs();

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
    /// 延迟关闭 context，确保 js 端完成清理任务
    final c = ctx;
    final ctxAddr = c.handleAddress;
    JsHandlerManager.disposeContext(ctxAddr);
    Future.delayed(const Duration(seconds: 10), () {
      c.dispose();
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
