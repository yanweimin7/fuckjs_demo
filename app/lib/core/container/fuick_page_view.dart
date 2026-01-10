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
          widget.controller.renderPage(
            widget.pageId,
            widget.routeInfo.path,
            widget.routeInfo.params,
          );
        }
      });
    }
  }

  @override
  void dispose() {
    widget.controller.isBundleLoaded.removeListener(_checkAndRender);
    widget.controller.destroyPage(widget.pageId);
    widget.controller.onPageRender.remove(widget.pageId);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: body ??
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
