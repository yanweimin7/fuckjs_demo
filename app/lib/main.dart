import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'core/container/fuick_app_page.dart';
import 'core/container/fuick_multi_tab_page.dart';
import 'core/engine/engine.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'QuickJS FFI Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      ),
      home: const MyHomePage(title: 'QuickJS FFI 示例'),
      routes: {},
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  void initState() {
    super.initState();
  }

  // 测试脚本已迁移到独立页面 demo_test.dart

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
        actions: [
          IconButton(
            onPressed: () {
              Navigator.of(context).pushNamed('/demo');
            },
            icon: const Icon(Icons.code),
            tooltip: '打开 QuickJS 测试页',
          ),
        ],
      ),
      body: Column(
        children: [
          ElevatedButton(
            onPressed: () {
              Engine.setUseBinaryProtocol(false);
              Navigator.of(context).push(
                CupertinoPageRoute(
                  builder: (BuildContext context) {
                    return FuickAppPage();
                  },
                ),
              );
            },
            child: Text('打开小程序'),
          ),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).push(
                CupertinoPageRoute(
                  builder: (BuildContext context) {
                    return const FuickMultiTabPage();
                  },
                ),
              );
            },
            child: const Text('打开多 Tab 示例 (多 Context)'),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        tooltip: '渲染 JS UI',
        child: const Icon(Icons.play_arrow_outlined),
      ),
    );
  }
}
