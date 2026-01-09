import 'package:flutter/material.dart';
import 'fuick_app_view.dart';

class FuickMultiTabPage extends StatefulWidget {
  const FuickMultiTabPage({super.key});

  @override
  State<FuickMultiTabPage> createState() => _FuickMultiTabPageState();
}

class _FuickMultiTabPageState extends State<FuickMultiTabPage> {
  int _currentIndex = 0;

  // 使用 PageStorageKey 保持各 Tab 状态
  final List<Widget> _tabs = [
    const FuickAppView(key: PageStorageKey('tab_1')),
    const FuickAppView(key: PageStorageKey('tab_2')),
    const FuickAppView(key: PageStorageKey('tab_3')),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _tabs,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: '首页',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.category),
            label: '分类',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: '我的',
          ),
        ],
      ),
    );
  }
}
