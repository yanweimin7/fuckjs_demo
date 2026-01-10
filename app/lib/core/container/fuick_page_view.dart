import 'package:flutter/material.dart';
import '../widgets/fuick_node.dart';
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
  final FuickNodeManager nodeManager = FuickNodeManager();
  FuickNode? rootNode;
  bool _hasRendered = false;

  @override
  void initState() {
    super.initState();
    widget.controller.onPageRender[widget.pageId] = (dsl) {
      if (rootNode == null) {
        rootNode = nodeManager.getOrCreateNode(dsl, nodeManager);
        if (mounted) setState(() {});
      } else {
        nodeManager.getOrCreateNode(dsl, nodeManager);
      }
    };

    widget.controller.onPagePatch[widget.pageId] = (patches) {
      nodeManager.applyPatches(patches, nodeManager);
    };

    // 监听 bundle 加载状态
    widget.controller.isBundleLoaded.addListener(_checkAndRender);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _checkAndRender();
    });
  }

  void _checkAndRender() {
    if (_hasRendered) return;
    if (widget.controller.isBundleLoaded.value) {
      _hasRendered = true;
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
      body: rootNode == null
          ? const Center(
              child: SizedBox(
                width: 100,
                height: 100,
                child: CircularProgressIndicator(),
              ),
            )
          : JSRender.buildFromNode(rootNode!, widget.controller),
    );
  }
}
