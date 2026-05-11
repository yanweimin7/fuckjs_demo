import 'dart:async';
import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:fuickjs_flutter/core/container/fuick_app_controller.dart'
    as fuick;
import 'package:fuickjs_flutter/core/container/fuick_navigation_delegate.dart';
import 'package:fuickjs_flutter/core/engine/engine.dart';
import 'package:fuickjs_flutter/core/logger.dart';
import 'package:fuickjs_flutter/core/service/native_services.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';

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
import 'debug_page.dart';
import 'fuick_app_page.dart';
import 'service/fuick_storage_service.dart';
import 'service/local_auth_service.dart';

final GlobalKey<NavigatorState> rootNavigatorKey = GlobalKey<NavigatorState>();

class BundleConfig {
  final String name;
  final String label;
  final String initialRoute;

  const BundleConfig({
    required this.name,
    required this.label,
    required this.initialRoute,
  });

  factory BundleConfig.fromJson(Map<String, dynamic> json) => BundleConfig(
        name: json['name'] as String,
        label: json['label'] as String? ?? json['name'] as String,
        initialRoute: json['initialRoute'] as String? ?? '/',
      );
}

Future<List<BundleConfig>> loadBundleConfigs() async {
  final raw = await rootBundle.loadString('assets/js/bundles.json');
  final list = jsonDecode(raw) as List<dynamic>;
  return list
      .map((e) => BundleConfig.fromJson(e as Map<String, dynamic>))
      .toList();
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  FuickNavigationDelegate.onRootPush = (path, params) async {
    final ctx = rootNavigatorKey.currentContext;
    if (ctx != null) {
      return await ctx.push(path, extra: params);
    }
    return null;
  };

  NativeServiceManager().registerService(() => HapticsService());
  NativeServiceManager().registerService(() => LauncherService());
  NativeServiceManager().registerService(() => ShareService());
  NativeServiceManager().registerService(() => AppInfoService());
  NativeServiceManager().registerService(() => PermissionsService());
  NativeServiceManager().registerService(() => MediaService());
  NativeServiceManager().registerService(() => ConnectivityService());

  NativeServiceManager().registerService(() => FuickStorageService());
  NativeServiceManager().registerService(() => LocalAuthService());

  fuick.widgetFactory.register(VideoPlayerParser());
  fuick.widgetFactory.register(VisibilityDetectorParser());
  fuick.widgetFactory.register(WebViewParser());

  EngineInit.preload();

  final bundles = await loadBundleConfigs();

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
