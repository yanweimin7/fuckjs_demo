import 'package:flutter/material.dart';

import '../engine/jsobject.dart';
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
      // 延迟一帧确保 JS 环境完全初始化
      Future.microtask(() {
        if (mounted) {
          renderPage(widget.pageId, widget.controller, widget.routeInfo);
        }
      });
    }
  }

  void renderPage(int pageId, FuickAppController controller, RouteInfo info) {
    final ctx = controller.ctx;
    final renderer = ctx.global.getProperty('ReactRenderer');
    if (renderer is JSObject) {
      renderer.invoke('render', [pageId, info.path, info.params]);
    } else {
      debugPrint('Warning: ReactRenderer not found in JS global context');
    }
  }

  @override
  void dispose() {
    widget.controller.isBundleLoaded.removeListener(_checkAndRender);
    try {
      final renderer = widget.controller.ctx.global.getProperty(
        'ReactRenderer',
      );
      if (renderer is JSObject) {
        renderer.invoke('destroy', [widget.pageId]);
      }
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
