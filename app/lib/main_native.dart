import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:fuickjs_flutter/core/container/dev_fuick_app_page.dart';
import 'package:fuickjs_flutter/core/container/fuick_app_controller.dart'
    as fuick;
import 'package:fuickjs_flutter/core/engine/engine.dart';
import 'package:fuickjs_flutter/core/fuick_config.dart';
import 'package:fuickjs_flutter/core/fuick_js.dart';
import 'package:fuickjs_flutter/core/logger.dart';
import 'package:fuickjs_flutter/core/service/native_services.dart';
import 'package:go_router/go_router.dart';
import 'package:wujie/fuick_swipe_tab_page.dart';

import 'community/app_info_service.dart';
import 'community/connectivity_service.dart';
import 'community/haptics_service.dart';
import 'community/launcher_service.dart';
import 'community/media_service.dart';
import 'community/permissions_service.dart';
import 'community/share_service.dart';
import 'community/video_player_parser.dart';
import 'community/visibility_detector_parser.dart';
import 'community/web_view_parser.dart';
import 'bundle_auto_reload_page.dart';
import 'compile_test_page.dart';
import 'debug_page.dart';
import 'engine_resilience_page.dart';
import 'error_page.dart';
import 'fuick_app_page.dart';
import 'offline_bootstrap.dart';
import 'service/file_obfuscator_service.dart';
import 'service/file_picker_service.dart';
import 'service/fuick_storage_service.dart';
import 'service/local_auth_service.dart';
import 'bundle_config.dart';

final GlobalKey<NavigatorState> rootNavigatorKey = GlobalKey<NavigatorState>();

void main() async {
  // 框架自身的启动职责 —— binding、日志级别、引擎参数、bundle 下发、路由钩子 ——
  // 全部收敛到这一次调用里。
  FuickJS.init(FuickConfig(
    // 强制 iOS 也使用 QuickJS 引擎（默认走 JSC 回退）。JSC 不支持字节码与
    // ES Module，字节码编译 / 模块加载等能力需要 QuickJS 引擎。
    engine: const FuickEngineConfig(useJscOnIos: false),
    // bundle 动态下发（内置 zip 验签 + 懒解压；远程默认关闭）。
    // 后台启动：首个 FuickAppView 打开时会等它落地，这里不必 await。
    offline: DemoOfflineBootstrap.config(),
    // 运行模式：优先加载 AOT 字节码。native 上全局一致，配一次即可，
    // 不用在每个 FuickAppView 挂载点重复传。
    useAotCode: true,
    // 自定义引擎错误页：框架内置的「灰图标 + 重试」是给所有宿主兜底的，
    // demo 换成自己那套（并能区分「引擎熔断」与普通失败，见 error_page.dart）。
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

  // ── 以下是宿主自己的业务注册 ──
  // 框架无从知道宿主有哪些 service / parser，所以这块**刻意留在 main 里手写**
  // （不进 FuickConfig）。只需早于首个 FuickAppView 挂载，写在 FuickJS.init
  // 之前或之后都可以。
  NativeServiceManager().registerService(() => HapticsService());
  NativeServiceManager().registerService(() => LauncherService());
  NativeServiceManager().registerService(() => ShareService());
  NativeServiceManager().registerService(() => AppInfoService());
  NativeServiceManager().registerService(() => PermissionsService());
  NativeServiceManager().registerService(() => MediaService());
  NativeServiceManager().registerService(() => ConnectivityService());

  NativeServiceManager().registerService(() => FuickStorageService());
  NativeServiceManager().registerService(() => LocalAuthService());
  NativeServiceManager().registerService(() => FilePickerService());
  NativeServiceManager().registerService(() => FileObfuscatorService());

  fuick.widgetFactory.register(VideoPlayerParser());
  fuick.widgetFactory.register(VisibilityDetectorParser());
  fuick.widgetFactory.register(WebViewParser());

  // ── 以下是宿主自己的调试兜底 ──
  // 这两个全局钩子属于宿主 App，**框架不碰**（FuickJS.init 不会覆盖它们）。
  // 接 Sentry / Bugly 时在这里换成 SDK 的上报调用即可。
  FlutterError.onError = (FlutterErrorDetails details) {
    logger.e('===== FLUTTER ERROR =====');
    logger.e('Exception: ${details.exception}');
    logger.e('Stack: ${details.stack}');
    logger.e('Library: ${details.library}');
    logger.e('Context: ${details.context}');
    for (final entry in details.informationCollector?.call() ?? []) {
      logger.e('Info: $entry');
    }
    debugPrint('===== FLUTTER ERROR =====', wrapWidth: 800);
    debugPrint('Exception: ${details.exception}', wrapWidth: 800);
    debugPrint('Stack: ${details.stack}', wrapWidth: 800);
    debugPrint('Library: ${details.library}', wrapWidth: 800);
    debugPrint('Context: ${details.context}', wrapWidth: 800);
  };

  PlatformDispatcher.instance.onError = (error, stack) {
    debugPrint('===== UNCAUGHT ERROR =====');
    debugPrint('Error: $error');
    debugPrint('Stack: $stack');
    return true;
  };

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
                    params:
                        (map['params'] as Map?)?.cast<String, dynamic>() ?? {},
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
                path: 'compile_test',
                builder: (context, state) => const CompileTestPage(),
              ),
              GoRoute(
                path: 'engine_resilience',
                builder: (context, state) => const EngineResiliencePage(),
              ),
              GoRoute(
                path: 'bundle_auto_reload',
                builder: (context, state) {
                  final map = state.extra as Map<String, dynamic>?;
                  return BundleAutoReloadPage(
                    appName: map?['appName'] as String? ?? 'bundle',
                    path: map?['path'] as String? ?? '/',
                  );
                },
              ),
              GoRoute(
                path: 'dev',
                builder: (context, state) => const DevFuickAppPage(),
              ),
              GoRoute(
                path: 'swipe_tabs',
                builder: (context, state) => const FuickSwipeTabPage(),
              ),
              GoRoute(
                path: 'file_obfuscator',
                builder: (context, state) => FuickAppPage(
                  appName: 'bundle',
                  path: '/demo/file_obfuscator',
                  params: const {},
                ),
              ),
            ],
          ),
        ],
      );

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: '无界',
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
  bool _warmedUp = false;

  @override
  Widget build(BuildContext context) {
    if (!_warmedUp) {
      _warmedUp = true;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) {
          fuick.widgetFactory.warmup(context);
        }
      });
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF5F6FA),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 1,
        title: const Text(
          '无界',
          style: TextStyle(
            color: Color(0xFF1A1A2E),
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          IconButton(
            tooltip: '文件保护',
            icon: const Icon(Icons.shield, color: Color(0xFF5C6BC0)),
            onPressed: () => context.push('/file_obfuscator'),
          ),
          IconButton(
            tooltip: '调试控制台',
            icon: const Icon(Icons.bug_report, color: Color(0xFF5C6BC0)),
            onPressed: () => context.push('/dev'),
          ),
          IconButton(
            tooltip: '字节码编译测试',
            icon: const Icon(Icons.memory, color: Color(0xFF5C6BC0)),
            onPressed: () => context.push('/compile_test'),
          ),
          IconButton(
            tooltip: '引擎健壮性测试',
            icon: const Icon(Icons.monitor_heart, color: Color(0xFF5C6BC0)),
            onPressed: () => context.push('/engine_resilience'),
          ),
          IconButton(
            tooltip: 'bundle 自动重载测试',
            icon: const Icon(Icons.replay_circle_filled, color: Color(0xFF4CAF50)),
            onPressed: () => context.push('/bundle_auto_reload'),
          ),
          IconButton(
            tooltip: '多 Tab 演示',
            icon: const Icon(Icons.dashboard, color: Color(0xFF5C6BC0)),
            onPressed: () => context.push('/swipe_tabs'),
          ),
          IconButton(
            tooltip: '引擎崩溃测试(故意 SIGSEGV, 用于验证符号化)',
            icon: const Icon(Icons.bolt, color: Color(0xFFEF5350)),
            onPressed: () => EngineInit.debugCrash(),
          ),
        ],
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
