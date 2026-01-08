import 'package:flutter/material.dart';

import 'fuick_app_controller.dart';
import 'js_ui.dart';

class RouteInfo {
  final String path;
  final Map<String, dynamic> params;

  RouteInfo(this.path, this.params);
}

class FuickPageView extends StatefulWidget {
  final int pageId;
  final FuickAppController controller;
  final RouteInfo routeInfo;

  const FuickPageView({
    super.key,
    required this.pageId,
    required this.controller,
    required this.routeInfo,
  });

  @override
  State<FuickPageView> createState() => _JsUiHostState();
}

class _JsUiHostState extends State<FuickPageView> {
  Widget? body;

  @override
  void initState() {
    super.initState();
    widget.controller.onPageRender[widget.pageId] = (dsl) {
      body = JSRender.buildFromDsl(dsl, widget.controller);
      if (mounted) setState(() {});
    };

    // 监听 bundle 加载状态
    widget.controller.isBundleLoaded.addListener(_checkAndRender);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _checkAndRender();
    });
  }

  void _checkAndRender() {
    if (widget.controller.isBundleLoaded.value) {
      renderPage(widget.pageId, widget.controller, widget.routeInfo);
    }
  }

  void renderPage(int pageId, FuickAppController controller, RouteInfo info) {
    controller.ctx.callFunction('ReactRenderer.render', [
      pageId,
      info.path,
      info.params,
    ]);
  }

  @override
  void dispose() {
    widget.controller.isBundleLoaded.removeListener(_checkAndRender);
    try {
      widget.controller.ctx.callFunction('ReactRenderer.destroy', [pageId]);
    } catch (e) {
      // ignore
    }
    widget.controller.onPageRender.remove(widget.pageId);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body:
          body ??
          Center(
            child: SizedBox(
              width: 100,
              height: 100,
              child: CircularProgressIndicator(),
            ),
          ),
    );
  }
}
