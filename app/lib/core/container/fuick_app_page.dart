import 'package:flutter/material.dart';
import 'package:flutter_quickjs/core/container/fuick_app_view.dart';

class FuickAppPage extends StatefulWidget {
  const FuickAppPage({super.key});

  @override
  State<FuickAppPage> createState() => _FuickAppPageState();
}

class _FuickAppPageState extends State<FuickAppPage> {
  @override
  Widget build(BuildContext context) {
    return FuickAppView(appName: 'fuick_js_test');
  }
}
