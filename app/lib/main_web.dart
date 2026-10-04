import 'package:flutter/material.dart';
import 'package:fuickjs_flutter/core/fuick_config.dart';
import 'package:fuickjs_flutter/core/fuick_js.dart';
import 'package:go_router/go_router.dart';
import 'package:wujie/fuick_swipe_tab_page.dart';

import 'debug_page.dart';
import 'error_page.dart';
import 'fuick_app_page.dart';
import 'bundle_config.dart';

// Web 版 demo 入口：复用与 native 相同的首页网格 + 路由，但跳过 QuickJS 引擎 /
// 离线包 / 原生服务初始化（这些在 Web 上不编译），bundle 通过 <script src> 加载。
// native-only 页面（compile_test / dev / file_obfuscator）不在 Web 路由里。

final GlobalKey<NavigatorState> rootNavigatorKey = GlobalKey<NavigatorState>();

void main() async {
  // 与 native 入口共用同一份初始化调用。engine / offline 在 Web 上是 no-op
  // （Web 没有 QuickJS/JSC 引擎，bundle 由 <script src> 直接加载），所以这里
  // 不传这两项，其余行为完全一致。
  FuickJS.init(FuickConfig(
    // Web 上加载走 <script src> 而非引擎，AOT 字节码无从谈起。
    useAotCode: false,
    // 一个应用只有一份 worker 脚本，配一次，所有 FuickAppView 共用。
    // 取不到/浏览器不支持 Worker 都会自动回退到主线程渲染。
    workerUrl: 'fuick-worker.js',
    // 与 native 入口共用同一个错误页（它读的 isWorkerPermanentlyFailed 在 Web
    // 上走空实现恒为 false，于是自然只显示「普通失败」那套文案）。
    errorBuilder: (context, error, retry) =>
        FuickErrorPage(error: error, onRetry: retry),
    onRootPush: (path, params) async {
      final ctx = rootNavigatorKey.currentContext;
      if (ctx != null) {
        return await ctx.push(path, extra: params);
      }
      return null;
    },
  ));

  // Web 不注册原生服务 / 解析器（它们在 Web 上不可编译）。
  final bundles = await loadBundleConfigs();
  runApp(MyApp(bundles: bundles));
}

class MyApp extends StatelessWidget {
  final List<BundleConfig> bundles;

  const MyApp({super.key, required this.bundles});

  GoRouter _buildRouter() => GoRouter(
        navigatorKey: rootNavigatorKey,
        routes: <RouteBase>[
          GoRoute(
            path: '/',
            builder: (context, state) => MyHomePage(bundles: bundles),
            routes: <RouteBase>[
              GoRoute(
                path: 'fuick_app',
                builder: (context, state) {
                  final map = state.extra as Map;
                  return FuickAppPage(
                    appName: map['appName'] as String,
                    path: map['path'] as String? ?? '/',
                    params: (map['params'] as Map?)?.cast<String, dynamic>() ?? {},
                  );
                },
              ),
              GoRoute(
                path: 'natie_demo_page',
                builder: (context, state) {
                  final params = state.extra as Map<String, dynamic>?;
                  return DebugPage(params: params);
                },
              ),
              GoRoute(
                path: 'swipe_tabs',
                builder: (context, state) => const FuickSwipeTabPage(),
              ),
            ],
          ),
        ],
      );

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: '无界 (Web)',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
        scaffoldBackgroundColor: Colors.white,
      ),
      routerConfig: _buildRouter(),
    );
  }
}

class MyHomePage extends StatefulWidget {
  final List<BundleConfig> bundles;

  const MyHomePage({super.key, required this.bundles});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F6FA),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 1,
        title: const Text(
          '无界 (Web)',
          style: TextStyle(
            color: Color(0xFF1A1A2E),
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: GridView.builder(
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 3,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
          childAspectRatio: 0.9,
        ),
        itemCount: widget.bundles.length,
        itemBuilder: (context, index) {
          final b = widget.bundles[index];
          return _GridCell(
            label: b.label,
            onTap: () => context.push('/fuick_app', extra: {
              'appName': b.name,
              'path': b.initialRoute,
            }),
          );
        },
      ),
    );
  }
}

class _GridCell extends StatelessWidget {
  final String label;
  final VoidCallback onTap;

  const _GridCell({required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.06),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: const Color(0xFFEEF0FF),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(
                Icons.widgets_outlined,
                size: 26,
                color: Color(0xFF5C6BC0),
              ),
            ),
            const SizedBox(height: 10),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: Text(
                label,
                style: const TextStyle(
                  color: Color(0xFF1A1A2E),
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                ),
                textAlign: TextAlign.center,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
