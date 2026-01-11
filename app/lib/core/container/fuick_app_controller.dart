import 'package:flutter/cupertino.dart';

import '../engine/jscontext_interface.dart';
import '../handler/js_handler_manager.dart';
import 'fuick_page.dart';
import 'fuick_page_view.dart';

int pageId = 0;

int get nextPageId {
  return ++pageId;
}

class FuickAppController {
  final IQuickJsContext ctx;
  final GlobalKey<NavigatorState> navKey = GlobalKey<NavigatorState>();
  final Map<String, Map<String, dynamic>> _routes = {};
  final Map<int, Function(Map<String, dynamic>)> onPageRender = {};
  final Map<int, Function(List<dynamic>)> onPagePatch = {};
  final NativeServiceBinder nativeServiceBinder = NativeServiceBinder();

  final ValueNotifier<bool> isBundleLoaded = ValueNotifier<bool>(false);

  FuickAppController(this.ctx) {
    nativeServiceBinder.init(ctx, this);
  }

  void render(int pageId, Map<String, dynamic> dsl) {
    // debugPrint(
    //     '[Flutter] Controller.render pageId: $pageId, type: ${dsl['type']}');
    onPageRender[pageId]?.call(dsl);
  }

  void patch(int pageId, List<dynamic> patches) {
    onPagePatch[pageId]?.call(patches);
  }

  void renderPage(int pageId, String path, Map<String, dynamic> params) {
    ctx.invoke('FuickUIController', 'render', [pageId, path, params]);
  }

  void destroyPage(int pageId) {
    ctx.invoke('FuickUIController', 'destroy', [pageId]);
  }

  void pushWithPath(String path, Map<String, dynamic> params) {
    final nav = navKey.currentState;
    if (nav == null) return;
    final id = nextPageId;

    nav.push(
      CupertinoPageRoute(
        settings: RouteSettings(name: path),
        builder: (_) => FuickPage(
          pageId: id,
          controller: this,
          routeInfo: RouteInfo(path, params),
        ),
      ),
    );
  }

  void pop() {
    final nav = navKey.currentState;
    if (nav == null) return;
    if (nav.canPop()) {
      nav.maybePop();
    } else {
      Navigator.of(nav.context, rootNavigator: true).pop();
    }
  }

  void registerRoute(String name, Map<String, dynamic> dsl) {
    _routes[name] = dsl;
  }

  void popTo(String name) {
    final nav = navKey.currentState;
    if (nav == null) return;
    nav.popUntil((route) => route.settings.name == name);
  }

  void dispose() {
    nativeServiceBinder.dispose();
    Future.delayed(const Duration(seconds: 10), () {
      ctx.dispose();
    });
  }
}

class FuickAppScope extends InheritedWidget {
  final FuickAppController controller;

  const FuickAppScope({
    super.key,
    required this.controller,
    required super.child,
  });

  static FuickAppController? of(BuildContext context) {
    return context
        .dependOnInheritedWidgetOfExactType<FuickAppScope>()
        ?.controller;
  }

  @override
  bool updateShouldNotify(FuickAppScope oldWidget) {
    return controller != oldWidget.controller;
  }
}
