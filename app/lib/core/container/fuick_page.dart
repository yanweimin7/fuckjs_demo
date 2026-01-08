import 'package:flutter/material.dart';

import 'fuick_app_controller.dart';
import 'fuick_page_view.dart';

class FuickPage extends StatefulWidget {
  final int pageId;
  final FuickAppController controller;
  final RouteInfo routeInfo;

  const FuickPage({
    super.key,
    required this.pageId,
    required this.controller,
    required this.routeInfo,
  });

  @override
  State<FuickPage> createState() => _FuickAppPageState();
}

class _FuickAppPageState extends State<FuickPage> {
  @override
  Widget build(BuildContext context) {
    return FuickPageView(
      pageId: widget.pageId,
      controller: widget.controller,
      routeInfo: widget.routeInfo,
    );
  }
}
