import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:fuickjs_flutter/core/container/dev_fuick_app_page.dart';
import 'package:fuickjs_flutter/core/engine/engine.dart';
import 'package:fuickjs_flutter/core/engine/fuick_app_context_manager.dart';
import 'package:fuickjs_flutter/core/fuick_config.dart';
import 'package:go_router/go_router.dart';

import 'debug_page.dart';
import 'fuick_app_page.dart';
import 'fuick_multi_tab_page.dart';
import 'fuick_multi_view_demo.dart';

final RouteObserver<ModalRoute<void>> routeObserver =
    RouteObserver<ModalRoute<void>>();

final GlobalKey<NavigatorState> rootNavigatorKey = GlobalKey<NavigatorState>();

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // 预热：engine init + bundle 加载 + 首页预渲染，与 UI 启动并行
  FuickAppContextManager().prewarm('bundle', pages: [
    PrewarmPageConfig('/'),
  ]);
  FuickAppContextManager().prewarm('taro-demo', pages: [
    PrewarmPageConfig('/'),
  ]);

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  static final GoRouter _router = GoRouter(
    navigatorKey: rootNavigatorKey,
    observers: [routeObserver],
    routes: <RouteBase>[
      GoRoute(
        path: '/',
        builder: (BuildContext context, GoRouterState state) {
          return const MyHomePage(title: 'QuickJS FFI 示例');
        },
        routes: <RouteBase>[
          GoRoute(
            path: 'fuick_app',
            builder: (BuildContext context, GoRouterState state) {
              final map = state.extra as Map;
              return FuickAppPage(
                appName: map['appName'],
                path: map['path'] ?? '/',
                params: map['params'] ?? {},
              );
            },
          ),
          GoRoute(
            path: 'natie_demo_page',
            builder: (BuildContext context, GoRouterState state) {
              final params = state.extra as Map<String, dynamic>?;
              return DebugPage(params: params);
            },
          ),
        ],
      ),
    ],
  );

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'QuickJS FFI Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      ),
      routerConfig: _router,
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  bool _prewarmed = true;

  @override
  void initState() {
    super.initState();
  }

  void _destroyAll() {
    FuickAppContextManager().destroyContext('bundle');
    FuickAppContextManager().destroyContext('taro-demo');
    setState(() => _prewarmed = false);
  }

  void _prewarmAll() {
    FuickAppContextManager().prewarm('bundle', pages: [PrewarmPageConfig('/')]);
    FuickAppContextManager().prewarm('taro-demo', pages: [PrewarmPageConfig('/')]);
    setState(() => _prewarmed = true);
  }

  // 测试脚本已迁移到独立页面 demo_test.dart

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
        actions: [],
      ),
      body: Column(
        children: [
          ElevatedButton(
            onPressed: () {
              context.push('/fuick_app',
                  extra: {'appName': 'bundle', 'path': '/'});
            },
            child: Text('打开示例'),
          ),
          ElevatedButton(
            onPressed: () {
              context.push('/fuick_app',
                  extra: {'appName': 'taro-demo', 'path': '/'});
            },
            child: const Text('打开 Taro Demo'),
          ),
          const SizedBox(height: 20),
          _prewarmed
              ? ElevatedButton(
                  onPressed: _destroyAll,
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
                  child: const Text('卸载预热（冷启动对比）',
                      style: TextStyle(color: Colors.white)),
                )
              : ElevatedButton(
                  onPressed: _prewarmAll,
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
                  child: const Text('重新预热',
                      style: TextStyle(color: Colors.white)),
                ),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).push(
                CupertinoPageRoute(
                  builder: (BuildContext context) {
                    return DevFuickAppPage(routeObserver: routeObserver);
                  },
                  settings: RouteSettings(name: debugRouteName),
                ),
              );
            },
            child: Text('打开调试页面'),
          ),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).push(
                CupertinoPageRoute(
                  builder: (BuildContext context) {
                    return const FuickMultiTabPage();
                  },
                ),
              );
            },
            child: const Text('打开多 Tab 示例'),
          ),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).push(
                CupertinoPageRoute(
                  builder: (BuildContext context) {
                    return const FuickMultiViewDemo();
                  },
                ),
              );
            },
            child: const Text('打开 Multi-View 示例 (同屏3页面)'),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        tooltip: '渲染 JS UI',
        child: const Icon(Icons.play_arrow_outlined),
      ),
    );
  }
}
