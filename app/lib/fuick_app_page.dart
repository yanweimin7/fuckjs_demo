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
    return FuickAppView(
      appName: appName,
      initialRoute: path,
      initialParams: params,
        // 内置 zip 以 .qjc 为主入口；若 zip 内仅有 .js（qjc 过期未重编）则自动回退。
        useAotCode: true,
    );
  }
}
