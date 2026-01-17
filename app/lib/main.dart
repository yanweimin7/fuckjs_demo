import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:fuickjs_core/core/engine/engine.dart';

import 'fuick_app_page.dart';
import 'fuick_multi_tab_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // 预热 Isolate 引擎，减少第一次打开小程序的延迟
  EngineInit.initIsolate();
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
        actions: [],
      ),
      body: Column(
        children: [
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).push(
                CupertinoPageRoute(
                  builder: (BuildContext context) {
                    return FuickAppPage();
                  },
                ),
              );
            },
            child: Text('打开示例'),
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
            child: const Text('打开多 Tab 示例'),
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
