import 'package:flutter/material.dart';

class WidgetUtils {
  static Widget wrapPadding(Map<String, dynamic> props, Widget child) {
    final p = props['padding'];
    if (p is num) {
      return Padding(padding: EdgeInsets.all(p.toDouble()), child: child);
    }
    final ei = edgeInsets(p);
    if (ei != null) {
      return Padding(padding: ei, child: child);
    }
    return child;
  }

  static Widget wrapMarginAndPadding(Map<String, dynamic> props, Widget child) {
    final margin = edgeInsets(props['margin']);
    final padding = edgeInsets(props['padding']);
    Widget c = child;
    if (padding != null) {
      c = Padding(padding: padding, child: c);
    }
    if (margin != null) {
      c = Padding(padding: margin, child: c);
    }
    return c;
  }

  static MainAxisAlignment mainAxis(String? v) {
    switch (v) {
      case 'start':
        return MainAxisAlignment.start;
      case 'end':
        return MainAxisAlignment.end;
      case 'spaceBetween':
        return MainAxisAlignment.spaceBetween;
      case 'spaceAround':
        return MainAxisAlignment.spaceAround;
      case 'spaceEvenly':
        return MainAxisAlignment.spaceEvenly;
      case 'center':
      default:
        return MainAxisAlignment.center;
    }
  }

  static CrossAxisAlignment crossAxis(String? v) {
    switch (v) {
      case 'start':
        return CrossAxisAlignment.start;
      case 'end':
        return CrossAxisAlignment.end;
      case 'stretch':
        return CrossAxisAlignment.stretch;
      case 'center':
      default:
        return CrossAxisAlignment.center;
    }
  }

  static MainAxisSize mainAxisSize(String? v) {
    switch (v) {
      case 'min':
        return MainAxisSize.min;
      case 'max':
      default:
        return MainAxisSize.max;
    }
  }

  static Alignment? alignment(String? v) {
    switch (v) {
      case 'center':
        return Alignment.center;
      case 'topLeft':
        return Alignment.topLeft;
      case 'topRight':
        return Alignment.topRight;
      case 'bottomLeft':
        return Alignment.bottomLeft;
      case 'bottomRight':
        return Alignment.bottomRight;
      default:
        return null;
    }
  }

  static Axis axis(String? v) {
    switch (v) {
      case 'horizontal':
        return Axis.horizontal;
      case 'vertical':
      default:
        return Axis.vertical;
    }
  }

  static BoxFit? boxFit(String? v) {
    switch (v) {
      case 'cover':
        return BoxFit.cover;
      case 'contain':
        return BoxFit.contain;
      case 'fill':
        return BoxFit.fill;
      case 'fitWidth':
        return BoxFit.fitWidth;
      case 'fitHeight':
        return BoxFit.fitHeight;
      case 'none':
        return BoxFit.none;
      case 'scaleDown':
        return BoxFit.scaleDown;
      default:
        return null;
    }
  }

  static Alignment stackAlignment(String? v) {
    return alignment(v) ?? Alignment.center;
  }

  static double? sizeNum(dynamic v) {
    if (v is num) return v.toDouble();
    return null;
  }

  static EdgeInsets? edgeInsets(dynamic v) {
    if (v is num) return EdgeInsets.all(v.toDouble());
    if (v is Map) {
      final m = Map<String, dynamic>.from(v);
      if (m.containsKey('all')) {
        return EdgeInsets.all((m['all'] as num).toDouble());
      }
      final double vertical =
          (m['vertical'] is num) ? (m['vertical'] as num).toDouble() : 0;
      final double horizontal =
          (m['horizontal'] is num) ? (m['horizontal'] as num).toDouble() : 0;

      return EdgeInsets.only(
        left: (m['left'] is num) ? (m['left'] as num).toDouble() : horizontal,
        top: (m['top'] is num) ? (m['top'] as num).toDouble() : vertical,
        right:
            (m['right'] is num) ? (m['right'] as num).toDouble() : horizontal,
        bottom:
            (m['bottom'] is num) ? (m['bottom'] as num).toDouble() : vertical,
      );
    }
    return null;
  }

  static Color? colorFromHex(String? hex) {
    if (hex == null || hex.isEmpty) return null;
    final s = hex.replaceFirst('#', '');
    final v = int.tryParse(s, radix: 16);
    if (v == null) return null;
    if (s.length <= 6) {
      return Color(0xFF000000 | v);
    }
    return Color(v);
  }

  static BoxDecoration? boxDecorationFromProps(Map<String, dynamic> props) {
    Color? color = colorFromHex(props['color'] as String?);
    BorderRadius? borderRadius = getBorderRadius(props['borderRadius']);
    Border? border = getBorder(props['border']);

    final decorationProp = props['decoration'];
    if (decorationProp is Map) {
      final m = Map<String, dynamic>.from(decorationProp);
      if (m['color'] != null) {
        color = colorFromHex(m['color'] as String?);
      }
      if (m['borderRadius'] != null) {
        borderRadius = getBorderRadius(m['borderRadius']);
      }
      if (m['border'] != null) {
        border = getBorder(m['border']);
      }
    }

    if (color == null && borderRadius == null && border == null) return null;
    return BoxDecoration(
      color: color,
      borderRadius: borderRadius,
      border: border,
    );
  }

  static Border? getBorder(dynamic v) {
    if (v is Map) {
      final m = Map<String, dynamic>.from(v);
      final color = colorFromHex(m['color'] as String?) ?? Colors.black;
      final width = sizeNum(m['width']) ?? 1.0;
      return Border.all(color: color, width: width);
    }
    return null;
  }

  static BorderRadius? getBorderRadius(dynamic br) {
    if (br is num) {
      return BorderRadius.circular(br.toDouble());
    } else if (br is Map) {
      final m = Map<String, dynamic>.from(br);
      return BorderRadius.only(
        topLeft: Radius.circular(sizeNum(m['topLeft']) ?? 0),
        topRight: Radius.circular(sizeNum(m['topRight']) ?? 0),
        bottomLeft: Radius.circular(sizeNum(m['bottomLeft']) ?? 0),
        bottomRight: Radius.circular(sizeNum(m['bottomRight']) ?? 0),
      );
    }
    return null;
  }
}
