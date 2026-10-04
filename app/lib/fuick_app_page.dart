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
    // bundleUrl 是**每个 bundle 各自的** <appName>.js，所以留在这里；
    // AOT 开关与 worker 入口脚本是全局的，配在 main 的 FuickConfig 里。
    final isWeb = kIsWeb;
    return FuickAppView(
      appName: appName,
      initialRoute: path,
      initialParams: params,
      bundleUrl: isWeb ? '$appName.js' : null,
    );
  }
}
