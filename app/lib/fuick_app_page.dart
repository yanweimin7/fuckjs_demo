import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:fuickjs_flutter/core/container/fuick_app_view.dart';

class FuickAppPage extends StatelessWidget {
  final String appName;
  final String path;
  final Map<String, dynamic> params;

  const FuickAppPage({
    super.key,
    required this.appName,
    required this.path,
    required this.params,
  });

  @override
  Widget build(BuildContext context) {
    // Web 不走离线包 / QuickJS 引擎，改用 <script src> 静态加载。
    // bundleUrl 对应 web/ 下部署的 <appName>.js，workerUrl 对应 fuick-worker.js。
    final isWeb = kIsWeb;
    return FuickAppView(
      appName: appName,
      initialRoute: path,
      initialParams: params,
      showMemoryMonitor: false,
      useAotCode: !isWeb,
      bundleUrl: isWeb ? '$appName.js' : null,
      workerUrl: isWeb ? 'fuick-worker.js' : null,
    );
  }
}
