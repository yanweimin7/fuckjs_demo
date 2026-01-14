import 'package:flutter/material.dart';

import '../widgets/fuick_node.dart';
import '../widgets/widget_factory.dart';
import 'fuick_app_controller.dart';

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

class _JsUiHostState extends State<FuickPageView> with RouteAware {
  final FuickNodeManager nodeManager = FuickNodeManager();
  FuickNode? rootNode;
  bool _hasRendered = false;
  bool _isVisible = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    widget.controller.routeObserver.subscribe(this, ModalRoute.of(context)!);
  }

  @override
  void dispose() {
    widget.controller.routeObserver.unsubscribe(this);
    widget.controller.isBundleLoaded.removeListener(_checkAndRender);
    widget.controller.destroyPage(widget.pageId);
    widget.controller.onPageRender.remove(widget.pageId);
    super.dispose();
  }

  @override
  void didPush() {
    // 页面被推入时触发
    _notifyVisible();
  }

  @override
  void didPopNext() {
    // 上层页面出栈，当前页面重新可见
    _notifyVisible();
  }

  @override
  void didPushNext() {
    // 推入新页面，当前页面变得不可见
    _notifyInvisible();
  }

  @override
  void didPop() {
    // 当前页面出栈，变得不可见
    _notifyInvisible();
  }

  void _notifyVisible() {
    if (!_isVisible) {
      _isVisible = true;
      widget.controller.notifyLifecycle(widget.pageId, 'visible');
    }
  }

  void _notifyInvisible() {
    if (_isVisible) {
      _isVisible = false;
      widget.controller.notifyLifecycle(widget.pageId, 'invisible');
    }
  }

  @override
  void initState() {
    super.initState();
    final startTime = DateTime.now();
    widget.controller.onPageRender[widget.pageId] = (dsl) {
      // final cost = DateTime.now().difference(startTime).inMilliseconds;
      // debugPrint(
      //   '[Performance] First render (pageId: ${widget.pageId}) cost: ${cost}ms from initState',
      // );

      // Initial render completed. If the page is currently visible, we need to notify JS again.
      // The initial 'visible' event from didPush might have been missed because the JS container
      // wasn't created yet.
      if (mounted && _isVisible) {
        widget.controller.notifyLifecycle(widget.pageId, 'visible');
      }

      // debugPrint(
      //   '[Flutter] FuickPageView.onPageRender pageId: ${widget.pageId}, rootNode exists: ${rootNode != null}',
      // );
      final newNode = nodeManager.createNode(dsl, nodeManager);
      if (rootNode != newNode) {
        rootNode = newNode;
        // debugPrint('[Flutter] FuickPageView set rootNode to: ${rootNode?.id}');
        if (mounted) setState(() {});
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
      WidgetsBinding.instance.addPostFrameCallback((_) {
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
          : FuickNodeManagerProvider(
              manager: nodeManager,
              child: FuickAppScope(
                controller: widget.controller,
                child: FuickPageScope(
                  pageId: widget.pageId,
                  child: widget.controller.widgetFactory.buildFromNode(
                    context,
                    rootNode!,
                    forceWrap: true,
                  ),
                ),
              ),
            ),
    );
  }
}

class FuickPageScope extends InheritedWidget {
  final int pageId;

  const FuickPageScope({super.key, required this.pageId, required super.child});

  static FuickPageScope? of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<FuickPageScope>();
  }

  static FuickPageScope? find(BuildContext context) {
    return context
        .getElementForInheritedWidgetOfExactType<FuickPageScope>()
        ?.widget as FuickPageScope?;
  }

  @override
  bool updateShouldNotify(FuickPageScope oldWidget) {
    return pageId != oldWidget.pageId;
  }
}
