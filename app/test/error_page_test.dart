import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:wujie/error_page.dart';

/// 错误页是纯 UI，不碰引擎 —— 所以它能在这里直接 pump，不需要 spawn worker。
///
/// 注意 `error_page.dart` 读的 `isWorkerPermanentlyFailed` 在测试环境（VM，
/// `dart.library.io` 为真）走 native 分支，而它是 `_instance?._permanentFailureNotified`
/// 的只读投影 —— 没 spawn 过 worker 时恒为 false，因此这里看到的都是「普通失败」
/// 那套文案。熔断态的文案由 `FuickAppView` 的集成路径覆盖，不在本文件。
void main() {
  Widget host(Widget child) => MaterialApp(home: child);

  testWidgets('普通失败：说清原因，重试回调绑到主按钮上', (tester) async {
    var retried = 0;
    await tester.pumpWidget(host(FuickErrorPage(
      error: StateError('bundle load failed'),
      onRetry: () => retried++,
    )));

    expect(find.text('页面加载失败'), findsOneWidget);
    // 「重新加载」而非「重启引擎」—— 熔断才用后者。
    expect(find.text('重新加载'), findsOneWidget);
    expect(find.text('重启引擎'), findsNothing);

    await tester.tap(find.text('重新加载'));
    expect(retried, 1);
  });

  testWidgets('界面上不出现错误详情 / 堆栈', (tester) async {
    await tester.pumpWidget(host(FuickErrorPage(
      error: StateError('bundle load failed: /data/app/bundle.js:42'),
      onRetry: () {},
    )));

    // 回归用例：曾经有一张可展开的「错误详情」卡把 `error.toString()` 展示出来
    // （默认两行截断、点开成 SelectableText）。用户看不懂堆栈也做不了什么，
    // `error` 现在只从「复制错误信息」这一个出口走。
    expect(find.text('错误详情'), findsNothing);
    expect(find.byType(SelectableText), findsNothing);
    expect(find.textContaining('bundle load failed'), findsNothing);
    expect(find.textContaining('/data/app/bundle.js'), findsNothing);
  });

  testWidgets('复制错误信息后按钮自身给出反馈，1.6s 后复位', (tester) async {
    // 默认的测试 binding 对未 mock 的平台通道回 null，而 `Clipboard.setData`
    // 没带 missingOk —— 不 mock 的话它会抛 MissingPluginException，又因为
    // `_copy()` 没 await 它，会变成一条无人处理的异步异常把用例判失败。
    // 这个出口是错误信息唯一的去处，所以顺带钉住"复制到的确实是 error 本身"。
    final clipboard = <String>[];
    tester.binding.defaultBinaryMessenger.setMockMethodCallHandler(
      SystemChannels.platform,
      (call) async {
        if (call.method == 'Clipboard.setData') {
          clipboard.add((call.arguments as Map)['text'] as String);
        }
        return null;
      },
    );
    addTearDown(() => tester.binding.defaultBinaryMessenger
        .setMockMethodCallHandler(SystemChannels.platform, null));

    await tester.pumpWidget(host(FuickErrorPage(
      error: StateError('bundle load failed'),
      onRetry: () {},
    )));

    expect(find.text('复制错误信息'), findsOneWidget);
    await tester.tap(find.text('复制错误信息'));
    await tester.pump();

    expect(clipboard.single, contains('bundle load failed'));
    expect(find.text('已复制'), findsOneWidget);

    // 必须把计时器走完：结束时挂着 pending timer 会让用例失败。
    await tester.pump(const Duration(milliseconds: 1700));
    expect(find.text('已复制'), findsNothing);
    expect(find.text('复制错误信息'), findsOneWidget);
  });
}
