import 'package:flutter/material.dart';

import '../../container/fuick_action.dart';
import '../widget_factory.dart';
import '../widget_utils.dart';
import 'widget_parser.dart';

class PageViewParser extends WidgetParser {
  @override
  String get type => 'PageView';

  final Map<String, PageController> _controllers = {};

  // _lastJSPage 是为了 打断“指令回环”并防止动画抖动 。
  //
  // 如果直接使用 controller.page ，在“JS 驱动 Flutter”和“Flutter 通知 JS”的双向通信中，很容易陷入死循环或产生抖动。
  //
  // ### 详细原因分析
  // 1. 防止动画过程中的“指令抖动” (Animation Stutter)
  //
  // - 场景 ：假设当前在第 0 页，JS 定时器触发要切到第 1 页。Flutter 收到指令开始动画 animateToPage(1) 。
  // - 问题 ： animateToPage 是一个耗时过程（约 300ms）。当动画进行到一半时（例如 controller.page 为 0.3），如果 JS 因为其他原因（比如倒计时更新）又发了一次 render 。
  // - 后果 ：此时 controller.page.round() 仍然是 0。如果没有 _lastJSPage 阻挡，代码会判断 1 != 0 ，于是 再次调用 animateToPage(1) 。这会导致动画被不断重置，用户看起来就是页面在“发抖”或者卡住。
  // 2. 打破状态更新的“死循环” (Break the Loop)
  //
  // - 场景 ：用户手动滑动到了第 2 页。
  // - Flutter -> JS ： onPageChanged 触发，通知 JS currentBannerIndex = 2 。
  // - JS -> Flutter ：React 状态更新，重新 render ，再次下发 currentPage: 2 给 Flutter。
  // - 问题 ：此时 Flutter 再次收到 currentPage: 2 。如果没有 _lastJSPage 记录“我刚刚已经处理过这个 2 了”，它可能会再次去检查 controller.page 。在某些边界情况下（例如惯性滚动还未完全停止），这可能导致不必要的动画调用。
  // - 解决 ： _lastJSPage 就像一个 去重过滤器 。只要 JS 发来的页码跟我上次处理的一样，我就直接忽略，无论当前动画状态如何。
  // 3. 生命周期安全性
  //
  // - controller.page 只有在 PageView 真正挂载（ hasClients 为 true）时才能读取，否则会抛红屏异常。
  // - _lastJSPage 是一个普通的 Dart 变量，随时可读写，更加安全。
  // ### 总结
  // _lastJSPage 的本质是 记录“JS 侧的最新意图” ，而不是“Flutter 侧的物理现状”。
  //
  // - JS 意图 ( _lastJSPage )：老板下达的命令。
  // - 物理现状 ( controller.page )：员工当前的工作进度。
  // 只有当 新命令 != 旧命令 时，我们才去调整工作进度。如果仅仅是检查工作进度（直接用 controller.page ），很容易因为进度没赶上命令而重复下令。
  final Map<String, int> _lastJSPage = {};

  @override
  Widget parse(
    BuildContext context,
    Map<String, dynamic> props,
    dynamic children,
    WidgetFactory factory,
  ) {
    final int? currentPage = (props['currentPage'] as num?)?.toInt();
    final String? refId = props['refId']?.toString();

    // debugPrint(
    //   'PageViewParser: parse refId=$refId, currentPage=$currentPage, lastJSPage=${_lastJSPage[refId]}',
    // );

    PageController? controller;
    if (refId != null) {
      controller = _controllers[refId];
      if (controller == null) {
        controller = PageController(initialPage: currentPage ?? 0);
        _controllers[refId] = controller;
      } else if (currentPage != null && _lastJSPage[refId] != currentPage) {
        // Only animate if the prop actually changed from the JS side
        _lastJSPage[refId] = currentPage;
        if (controller.hasClients && controller.page?.round() != currentPage) {
          debugPrint('PageViewParser: animating to page $currentPage');
          Future.microtask(() {
            controller?.animateToPage(
              currentPage,
              duration: const Duration(milliseconds: 300),
              curve: Curves.easeInOut,
            );
          });
        }
      }
    }

    return WidgetUtils.wrapPadding(
      props,
      PageView(
        key: refId != null ? ValueKey('pageview_$refId') : null,
        controller: controller,
        scrollDirection: props['scrollDirection'] == 'vertical'
            ? Axis.vertical
            : Axis.horizontal,
        onPageChanged: (index) {
          if (refId != null) {
            _lastJSPage[refId] = index;
          }
          if (props['onPageChanged'] != null) {
            FuickAction.event(context, props['onPageChanged'], value: index);
          }
        },
        children: factory.buildChildren(context, children),
      ),
    );
  }

  @override
  void dispose(int nodeId) {
    // We are using refId for controller management, which is a string.
    // The nodeId cleanup is handled by the framework but we might not have a direct mapping here.
    // PageControllers in _controllers will persist as long as the parser lives or until manually cleared.
  }
}
