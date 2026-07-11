import 'package:flutter/material.dart';
import 'package:fuickjs_flutter/core/container/fuick_app_view.dart';

class FuickSwipeTabPage extends StatefulWidget {
  const FuickSwipeTabPage({super.key});

  @override
  State<FuickSwipeTabPage> createState() => _FuickSwipeTabPageState();
}

class _TabSpec {
  final String label;
  final IconData icon;
  final String initialRoute;

  const _TabSpec(this.label, this.icon, this.initialRoute);
}

const List<_TabSpec> _tabs = [
  _TabSpec('行情', Icons.show_chart, '/market'),
  _TabSpec('商城', Icons.shopping_cart_outlined, '/'),
  _TabSpec('组件', Icons.widgets_outlined, '/demos'),
];

class _FuickSwipeTabPageState extends State<FuickSwipeTabPage> {
  final PageController _pageController = PageController();
  int _currentIndex = 0;

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _onPageChanged(int index) {
    if (_currentIndex != index) {
      setState(() => _currentIndex = index);
    }
  }

  void _onTabTapped(int index) {
    if (index == _currentIndex) return;
    _pageController.animateToPage(
      index,
      duration: const Duration(milliseconds: 250),
      curve: Curves.easeOut,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('多 Tab 演示'),
        backgroundColor: Colors.white,
        elevation: 1,
      ),
      body: PageView(
        controller: _pageController,
        onPageChanged: _onPageChanged,
        allowImplicitScrolling: false,
        children: [
          for (final t in _tabs)
            KeepAliveWrapper(
              child: FuickAppView(
                key: ValueKey(t.initialRoute),
                appName: 'bundle',
                initialRoute: t.initialRoute,
                useAotCode: true,
                showMemoryMonitor: true,
              ),
            ),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: _onTabTapped,
        items: [
          for (final t in _tabs)
            BottomNavigationBarItem(
              icon: Icon(t.icon),
              label: t.label,
            ),
        ],
      ),
    );
  }
}

class KeepAliveWrapper extends StatefulWidget {
  final Widget child;

  const KeepAliveWrapper({super.key, required this.child});

  @override
  State<KeepAliveWrapper> createState() => _KeepAliveWrapperState();
}

class _KeepAliveWrapperState extends State<KeepAliveWrapper>
    with AutomaticKeepAliveClientMixin {
  @override
  bool get wantKeepAlive => true;

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return widget.child;
  }
}
