import 'package:flutter/material.dart';
import 'package:fuickjs_flutter/core/container/fuick_app_view.dart';

class FuickWalletPage extends StatelessWidget {
  final String initialRoute;

  const FuickWalletPage({
    super.key,
    this.initialRoute = '/',
  });

  @override
  Widget build(BuildContext context) {
    return FuickAppView(
      appName: 'bundle',
      initialRoute: initialRoute,
      initialParams: {},
    );
  }
}