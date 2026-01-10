import 'package:flutter/material.dart';
import '../widget_factory.dart';
import '../widget_utils.dart';
import 'widget_parser.dart';

class ImageParser extends WidgetParser {
  @override
  String get type => 'Image';

  @override
  Widget parse(BuildContext context, Map<String, dynamic> props, dynamic children, WidgetFactory factory) {
    final url = (props['url'] ?? '') as String;
    final fit = WidgetUtils.boxFit(props['fit'] as String?);
    final borderRadius = WidgetUtils.getBorderRadius(props['borderRadius']);
    Widget image = Image.network(
      url,
      width: WidgetUtils.sizeNum(props['width']),
      height: WidgetUtils.sizeNum(props['height']),
      fit: fit,
      errorBuilder: (context, error, stackTrace) {
        return Container(
          width: WidgetUtils.sizeNum(props['width']),
          height: WidgetUtils.sizeNum(props['height']),
          color: Colors.grey[300],
          child: const Icon(Icons.error_outline),
        );
      },
    );
    if (borderRadius != null) {
      image = ClipRRect(borderRadius: borderRadius, child: image);
    }
    return WidgetUtils.wrapPadding(props, image);
  }
}
