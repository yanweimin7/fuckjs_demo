import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class DebugPage extends StatefulWidget {
  final Map<String, dynamic>? params;

  const DebugPage({super.key, this.params});

  @override
  State<DebugPage> createState() => _DebugPageState();
}

class _DebugPageState extends State<DebugPage> {
  String? _result;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Debug Page'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              '我是原生页面',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            if (widget.params != null) ...[
              const SizedBox(height: 20),
              Text(
                'Params: ${widget.params}',
                style: const TextStyle(color: Colors.grey),
              ),
            ],
            if (_result != null) ...[
              const SizedBox(height: 20),
              Text('Result from JS: $_result'),
            ],
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () async {
                final res = await context.push('/fuick_app', extra: {
                  'appName': 'bundle',
                  'path': '/hybrid_demo',
                  'params': {'from': 'native', 'timestamp': 123456}
                });
                setState(() {
                  _result = res?.toString();
                });
              },
              child: const Text('打开一个新的js页面并等待返回'),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                if (context.canPop()) {
                  context.pop('我是flutter页面返回的参数');
                }
              },
              child: const Text('返回并携带参数'),
            ),
          ],
        ),
      ),
    );
  }
}
