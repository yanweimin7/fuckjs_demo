import 'dart:async';

import 'package:flutter/cupertino.dart';
import 'package:flutter/services.dart';

import '../engine/engine.dart';
import '../engine/jscontext_delegate.dart';
import '../engine/jscontext_interface.dart';
import 'fuick_app_controller.dart';
import 'fuick_page_view.dart';

class FuickAppView extends StatefulWidget {
  final String appName;
  final bool useIsolate;
  final bool useAotCode;

  const FuickAppView({
    super.key,
    required this.appName,
    this.useIsolate = true,
    this.useAotCode = true,
  });

  @override
  State<FuickAppView> createState() => _FuickAppViewState();
}

class _FuickAppViewState extends State<FuickAppView> {
  late IQuickJsContext ctx;
  late FuickAppController _appController;
  late int pageId = nextPageId;
  bool _canInnerPop = false;
  bool _isReady = false;

  late final NavigatorObserver _observer = _FuickNavigatorObserver(() {
    if (mounted) {
      final canPop = _appController.navKey.currentState?.canPop() ?? false;
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
    _initEngine();
  }

  Future<void> _initEngine() async {
    if (widget.useIsolate) {
      final contextId =
          '${widget.appName}_${DateTime.now().microsecondsSinceEpoch}';
      await EngineInit.initIsolate();
      final delegate = JsContextDelegate(contextId);
      await delegate.init();
      ctx = delegate;
    } else {
      if (EngineInit.qjs == null) {
        EngineInit.initQjs();
      }
      ctx = EngineInit.runtime!.createContext();
    }
    _appController = FuickAppController(ctx);
    setState(() {
      _isReady = true;
    });

    _loadBundle();
  }

  Future<void> _loadBundle() async {
    if (!_isReady) return;
    try {
      // 1. 加载基础框架包 (framework.bundle)
      await _loadSingleBundle('framework.bundle');
      // 2. 加载业务逻辑包
      await _loadSingleBundle(widget.appName);

      _appController.isBundleLoaded.value = true;
    } catch (e) {
      debugPrint('加载 React bundle 失败: $e');
    }
  }

  Future<void> _loadSingleBundle(String bundleName) async {
    try {
      // 优先加载二进制字节码
      try {
        if (widget.useIsolate) {
          if (widget.useAotCode) {
            await ctx.evalBinaryFile('assets/js/$bundleName.qjc');
          } else {
            await ctx.evalFile('assets/js/$bundleName.js');
          }
        } else {
          if (widget.useAotCode) {
            final ByteData data = await rootBundle.load(
              'assets/js/$bundleName.qjc',
            );
            final Uint8List bytes = data.buffer.asUint8List(
              data.offsetInBytes,
              data.lengthInBytes,
            );
            await ctx.evalBinary(bytes);
          } else {
            final bundle = await rootBundle.loadString(
              'assets/js/$bundleName.js',
            );
            await ctx.eval(bundle);
          }
        }
        debugPrint('成功加载 QuickJS 字节码 bundle $bundleName');
      } catch (e) {
        debugPrint('加载字节码 bundle $bundleName 失败，尝试加载文本 bundle: $e');
        if (widget.useIsolate) {
          await ctx.evalFile('assets/js/$bundleName.js');
        } else {
          final bundle = await rootBundle.loadString(
            'assets/js/$bundleName.js',
          );
          await ctx.eval(bundle);
        }
        debugPrint('成功加载文本 bundle $bundleName');
      }
    } catch (e) {
      debugPrint('加载 bundle $bundleName 失败: $e');
      // 基础框架包加载失败可能是致命的，业务包加载失败也可能是致命的
      rethrow;
    }
  }

  @override
  Widget build(BuildContext context) {
    if (!_isReady) {
      return const Center(child: CupertinoActivityIndicator());
    }
    return PopScope(
      canPop: !_canInnerPop,
      onPopInvokedWithResult: (bool didPop, dynamic result) async {
        if (didPop) return;
        final NavigatorState? nav = _appController.navKey.currentState;
        if (nav != null && nav.canPop()) {
          nav.pop();
        }
      },
      child: Navigator(
        key: _appController.navKey,
        observers: [_observer],
        onGenerateInitialRoutes: (NavigatorState nav, String initialRoute) {
          return [
            CupertinoPageRoute(
              builder: (_) => FuickPageView(
                pageId: pageId,
                controller: _appController,
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
    _appController.dispose();
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
