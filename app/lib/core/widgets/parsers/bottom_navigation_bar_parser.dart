import 'package:flutter/material.dart';

import '../../container/fuick_action.dart';
import '../../utils/extensions.dart';
import '../fuick_node.dart';
import '../widget_factory.dart';
import '../widget_utils.dart';
import 'widget_parser.dart';

class BottomNavigationBarParser extends WidgetParser {
  @override
  String get type => 'BottomNavigationBar';

  @override
  Widget parse(
    BuildContext context,
    Map<String, dynamic> props,
    dynamic children,
    WidgetFactory factory,
  ) {
    final itemsDsl = props['items'];
    final items = <BottomNavigationBarItem>[];

    if (itemsDsl is List) {
      for (final itemDsl in itemsDsl) {
        if (itemDsl is FuickNode) {
          _parseItem(context, itemDsl.props, items, factory);
        } else if (itemDsl is Map) {
          final props = itemDsl['props'];
          if (props is Map) {
            _parseItem(
              context,
              Map<String, dynamic>.from(props),
              items,
              factory,
            );
          } else {
            // Fallback for flat structure if props is missing
            _parseItem(
              context,
              Map<String, dynamic>.from(itemDsl),
              items,
              factory,
            );
          }
        }
      }
    }
    return BottomNavigationBar(
      items: items,
      currentIndex: asInt(props['currentIndex']),
      onTap: (index) {
        if (props['onTap'] != null) {
          FuickAction.event(context, props['onTap'], value: index);
        }
      },
      elevation: (props['elevation'] as num?)?.toDouble(),
      type: _parseType(props['type']),
      fixedColor: WidgetUtils.colorFromHex(props['fixedColor']),
      backgroundColor: WidgetUtils.colorFromHex(props['backgroundColor']),
      iconSize: (props['iconSize'] as num?)?.toDouble() ?? 24.0,
      selectedItemColor: WidgetUtils.colorFromHex(props['selectedItemColor']),
      unselectedItemColor: WidgetUtils.colorFromHex(
        props['unselectedItemColor'],
      ),
      selectedFontSize: (props['selectedFontSize'] as num?)?.toDouble() ?? 14.0,
      unselectedFontSize:
          (props['unselectedFontSize'] as num?)?.toDouble() ?? 12.0,
      showSelectedLabels: props['showSelectedLabels'],
      showUnselectedLabels: props['showUnselectedLabels'],
    );
  }

  void _parseItem(
    BuildContext context,
    Map<String, dynamic> itemProps,
    List<BottomNavigationBarItem> items,
    WidgetFactory factory,
  ) {
    final iconDsl = itemProps['icon'];
    final activeIconDsl = itemProps['activeIcon'];
    final label = itemProps['label']?.toString();

    items.add(
      BottomNavigationBarItem(
        icon: iconDsl != null
            ? factory.build(context, iconDsl)
            : const SizedBox(),
        activeIcon: activeIconDsl != null
            ? factory.build(context, activeIconDsl)
            : null,
        label: label,
        backgroundColor: WidgetUtils.colorFromHex(itemProps['backgroundColor']),
        tooltip: itemProps['tooltip']?.toString(),
      ),
    );
  }

  BottomNavigationBarType? _parseType(String? type) {
    if (type == 'fixed') return BottomNavigationBarType.fixed;
    if (type == 'shifting') return BottomNavigationBarType.shifting;
    return null;
  }
}
