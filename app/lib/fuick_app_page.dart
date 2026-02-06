import 'package:flutter/material.dart';
import 'package:fuickjs_flutter/core/container/fuick_app_view.dart';
import 'package:go_router/go_router.dart';

class FuickAppPage extends StatefulWidget {
  final String appName;
  final String path;
  final Map<String, dynamic> params;

  const FuickAppPage(
      {super.key,
      required this.appName,
      required this.path,
      required this.params});

  @override
  State<FuickAppPage> createState() => _FuickAppPageState();
}

class _FuickAppPageState extends State<FuickAppPage> {
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    print('wine init $hashCode');
  }

  @override
  void dispose() {
    super.dispose();
    print("wine fuick app dispose $hashCode");
  }

  @override
  Widget build(BuildContext context) {
    return FuickAppView(
      appName: widget.appName,
      initialRoute: widget.path,
      initialParams: widget.params,
    );
  }
}
