import 'package:flutter/cupertino.dart';

import '../engine/jscontext.dart';
import 'fuick_page.dart';
import 'fuick_page_view.dart';

int pageId = 0;

int get nextPageId {
  return ++pageId;
}

class FuickAppController {
  final QuickJsContext ctx;
  final GlobalKey<NavigatorState> navKey = GlobalKey<NavigatorState>();
  final Map<String, Map<String, dynamic>> _routes = {};
  final Map<int, Function(Map<String, dynamic>)> onPageRender = {};

  final ValueNotifier<bool> isBundleLoaded = ValueNotifier<bool>(false);

  FuickAppController(this.ctx);

  void render(int pageId, Map<String, dynamic> dsl) {
    onPageRender[pageId]?.call(dsl);
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
}
