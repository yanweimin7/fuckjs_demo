import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:logger/logger.dart';

import 'service/in_app_log.dart';

/// App 内日志查看页。
///
/// 为什么需要它：`flutter run` 的 console 会被刷掉、系统日志可能被裁剪，
/// 而"放几小时后台再回来"这类问题恰恰只能在**当时**留下痕迹。这个页面读的是
/// 设备上的环形缓冲（[InAppLog]），随时打开随时看，还能整段复制走。
class InAppLogPage extends StatefulWidget {
  const InAppLogPage({super.key});

  @override
  State<InAppLogPage> createState() => _InAppLogPageState();
}

class _InAppLogPageState extends State<InAppLogPage> {
  final ScrollController _scroll = ScrollController();
  /// 最低级别过滤（显示 >= 该级别的记录）。
  Level _minLevel = Level.trace;
  /// 是否自动跟随最新一条。
  bool _follow = true;

  static const Map<Level, String> _labels = {
    Level.trace: 'TRACE',
    Level.debug: 'DEBUG',
    Level.info: 'INFO',
    Level.warning: 'WARN',
    Level.error: 'ERROR',
  };

  @override
  void dispose() {
    _scroll.dispose();
    super.dispose();
  }

  void _scheduleFollowTail() {
    if (!_follow) return;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted || !_scroll.hasClients) return;
      _scroll.jumpTo(_scroll.position.maxScrollExtent);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('App 内日志'),
        actions: [
          IconButton(
            tooltip: _follow ? '停止跟随最新' : '跟随最新',
            icon: Icon(_follow ? Icons.push_pin : Icons.push_pin_outlined),
            onPressed: () => setState(() => _follow = !_follow),
          ),
          PopupMenuButton<String>(
            tooltip: '复制',
            icon: const Icon(Icons.copy_all),
            onSelected: _copy,
            itemBuilder: (_) => const [
              PopupMenuItem(
                value: 'all',
                child: Text('复制筛选后的全部'),
              ),
              PopupMenuItem(
                value: 'recent',
                child: Text('复制筛选后的最近 200 条'),
              ),
              PopupMenuItem(
                value: 'errors',
                child: Text('只复制 WARN 以上（定位故障用）'),
              ),
              PopupMenuItem(
                value: 'withHeader',
                child: Text('复制全部 + 头部信息'),
              ),
            ],
          ),
          IconButton(
            tooltip: '清空',
            icon: const Icon(Icons.delete_outline),
            onPressed: () => setState(InAppLog.instance.clear),
          ),
        ],
      ),
      body: Column(
        children: [
          _buildFilterBar(),
          _buildHintBar(),
          const Divider(height: 1),
          Expanded(
            child: ValueListenableBuilder<int>(
              valueListenable: InAppLog.instance.revision,
              builder: (_, __, ___) {
                final rows = InAppLog.instance.recordsAtLeast(_minLevel);
                _scheduleFollowTail();
                if (rows.isEmpty) {
                  return const Center(child: Text('暂无日志'));
                }
                return ListView.builder(
                  controller: _scroll,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  itemCount: rows.length,
                  itemBuilder: (_, i) {
                    final r = rows[i];
                    final text = r.format();
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 2),
                      // SelectableText：可以手动划选任意片段复制；
                      // 长按：复制这一条。日志不能只靠"复制全部"——
                      // 几百上千行里捞一条关键记录全靠手动划太痛苦。
                      child: GestureDetector(
                        onLongPress: () => _copyOne(text),
                        child: SelectableText(
                          text,
                          style: TextStyle(
                            fontFamily: 'monospace',
                            fontSize: 11,
                            height: 1.25,
                            color: _colorOf(r.level),
                          ),
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHintBar() {
    return Container(
      width: double.infinity,
      color: const Color(0xFFF3F4F8),
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      child: ValueListenableBuilder<int>(
        valueListenable: InAppLog.instance.revision,
        builder: (_, __, ___) => Text(
          '共 ${InAppLog.instance.length} 条（上限 800，滚动丢弃最旧）· '
          '长按单条复制 · 可直接划选复制 · 右上角复制全部',
          style: const TextStyle(fontSize: 10, color: Color(0xFF6B7280)),
        ),
      ),
    );
  }

  Future<void> _copyOne(String text) async {
    await Clipboard.setData(ClipboardData(text: text));
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('已复制这条日志'), duration: Duration(seconds: 1)),
    );
  }

  Future<void> _copy(String what) async {
    final log = InAppLog.instance;
    final minLevel = what == 'errors' ? Level.warning : _minLevel;
    var rows = log.recordsAtLeast(minLevel);
    String header = '';
    if (what == 'recent') {
      if (rows.length > 200) rows = rows.sublist(rows.length - 200);
    } else if (what == 'withHeader') {
      rows = log.recordsAtLeast(Level.trace);
      header = [
        '# FuickJS app 日志导出',
        '# 导出时间: ${DateTime.now().toIso8601String()}',
        '# 总条数: ${log.length}',
        '',
      ].join('\n');
    }
    final text = header + rows.map((r) => r.format()).join('\n');
    if (text.isEmpty) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('当前筛选下没有日志')),
      );
      return;
    }
    await Clipboard.setData(ClipboardData(text: text));
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('已复制 ${rows.length} 条 / ${text.length} 字符，去聊天框粘贴即可'),
      ),
    );
  }

  Widget _buildFilterBar() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
      child: Wrap(
        spacing: 6,
        children: _labels.entries.map((e) {
          final selected = e.key == _minLevel;
          return ChoiceChip(
            label: Text(e.value, style: const TextStyle(fontSize: 11)),
            selected: selected,
            visualDensity: VisualDensity.compact,
            onSelected: (_) => setState(() => _minLevel = e.key),
          );
        }).toList(),
      ),
    );
  }

  static Color _colorOf(Level level) {
    if (level >= Level.error) return const Color(0xFFD32F2F);
    if (level >= Level.warning) return const Color(0xFFEF6C00);
    if (level >= Level.info) return const Color(0xFF1565C0);
    return const Color(0xFF616161);
  }
}