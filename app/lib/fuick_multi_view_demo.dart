import 'package:flutter/material.dart';
import 'package:fuickjs_flutter/core/container/fuick_app_view.dart';

class FuickMultiViewDemo extends StatelessWidget {
  const FuickMultiViewDemo({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Multi-View Demo')),
      body: Row(
        children: [
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                border: Border(bottom: BorderSide(color: Colors.grey.shade300)),
              ),
              child: const FuickAppView(
                appName: 'bundle',
                initialRoute: '/',
              ),
            ),
          ),
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                border: Border(bottom: BorderSide(color: Colors.grey.shade300)),
              ),
              child: const FuickAppView(
                appName: 'bundle',
                initialRoute: '/news',
              ),
            ),
          ),
          Expanded(
            child: const FuickAppView(
              appName: 'bundle',
              initialRoute: '/demos',
            ),
          ),
        ],
      ),
    );
  }
}
