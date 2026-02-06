import 'package:flutter/material.dart';
import 'package:fuickjs_flutter/core/container/fuick_app_view.dart';

class FuickMultiTabPage extends StatefulWidget {
  const FuickMultiTabPage({super.key});

  @override
  State<FuickMultiTabPage> createState() => _FuickMultiTabPageState();
}

class _FuickMultiTabPageState extends State<FuickMultiTabPage> {
  int _currentIndex = 0;

  // 使用 PageStorageKey 保持各 Tab 状态
  final List<Widget> _tabs = [
    const FuickAppView(
      key: PageStorageKey('tab_1'),
      appName: 'bundle',
    ),
    const FuickAppView(
      key: PageStorageKey('tab_2'),
      appName: 'test',
    ),
    const FuickAppView(key: PageStorageKey('tab_3'), appName: 'fuick_js_test'),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(index: _currentIndex, children: _tabs),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: '首页'),
          BottomNavigationBarItem(icon: Icon(Icons.category), label: '分类'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: '我的'),
        ],
      ),
    );
  }
}
