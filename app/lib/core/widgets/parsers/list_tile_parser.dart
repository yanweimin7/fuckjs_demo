import 'package:flutter/material.dart';
import '../../container/fuick_action.dart';
import '../widget_factory.dart';
import '../widget_utils.dart';
import 'widget_parser.dart';

class ListTileParser extends WidgetParser {
  @override
  String get type => 'ListTile';

  @override
  Widget parse(BuildContext context, Map<String, dynamic> props,
      dynamic children, WidgetFactory factory) {
    final leadingDsl = props['leading'];
    final titleDsl = props['title'];
    final subtitleDsl = props['subtitle'];
    final trailingDsl = props['trailing'];

    return ListTile(
      leading: leadingDsl != null ? factory.build(context, leadingDsl) : null,
      title: titleDsl != null ? factory.build(context, titleDsl) : null,
      subtitle:
          subtitleDsl != null ? factory.build(context, subtitleDsl) : null,
      trailing:
          trailingDsl != null ? factory.build(context, trailingDsl) : null,
      isThreeLine: props['isThreeLine'] ?? false,
      dense: props['dense'],
      // visualDensity: WidgetUtils.visualDensity(props['visualDensity']),
      // shape: WidgetUtils.shapeBorder(props['shape']),
      contentPadding: WidgetUtils.edgeInsets(props['contentPadding']),
      enabled: props['enabled'] ?? true,
      onTap: props['onTap'] != null
          ? () => FuickAction.event(context, props['onTap'])
          : null,
      onLongPress: props['onLongPress'] != null
          ? () => FuickAction.event(context, props['onLongPress'])
          : null,
      selected: props['selected'] ?? false,
      focusColor: WidgetUtils.colorFromHex(props['focusColor']),
      hoverColor: WidgetUtils.colorFromHex(props['hoverColor']),
      tileColor: WidgetUtils.colorFromHex(props['tileColor']),
      selectedTileColor: WidgetUtils.colorFromHex(props['selectedTileColor']),
    );
  }
}
