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
    List<BoxShadow>? boxShadow = getBoxShadow(props['boxShadow']);

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
      if (m['boxShadow'] != null) {
        boxShadow = getBoxShadow(m['boxShadow']);
      }
    }

    if (color == null &&
        borderRadius == null &&
        border == null &&
        boxShadow == null) return null;
    return BoxDecoration(
      color: color,
      borderRadius: borderRadius,
      border: border,
      boxShadow: boxShadow,
    );
  }

  static List<BoxShadow>? getBoxShadow(dynamic v) {
    if (v is Map) {
      final m = Map<String, dynamic>.from(v);
      final color = colorFromHex(m['color'] as String?) ?? Colors.black26;
      final blurRadius = sizeNum(m['blurRadius']) ?? 0.0;
      final spreadRadius = sizeNum(m['spreadRadius']) ?? 0.0;
      final offsetMap = m['offset'] as Map?;
      final offset = Offset(
        sizeNum(offsetMap?['dx']) ?? 0.0,
        sizeNum(offsetMap?['dy']) ?? 0.0,
      );
      return [
        BoxShadow(
          color: color,
          blurRadius: blurRadius,
          spreadRadius: spreadRadius,
          offset: offset,
        )
      ];
    } else if (v is List) {
      return v
          .map((e) => getBoxShadow(e))
          .whereType<List<BoxShadow>>()
          .expand((e) => e)
          .toList();
    }
    return null;
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

  static ScrollPhysics? scrollPhysics(String? v) {
    switch (v) {
      case 'never':
        return const NeverScrollableScrollPhysics();
      case 'bouncing':
        return const BouncingScrollPhysics();
      case 'clamping':
        return const ClampingScrollPhysics();
      case 'always':
        return const AlwaysScrollableScrollPhysics();
      default:
        return null;
    }
  }

  static Curve curve(String? v) {
    switch (v) {
      case 'linear':
        return Curves.linear;
      case 'easeIn':
        return Curves.easeIn;
      case 'easeOut':
        return Curves.easeOut;
      case 'easeInOut':
        return Curves.easeInOut;
      case 'bounceIn':
        return Curves.bounceIn;
      case 'bounceOut':
        return Curves.bounceOut;
      default:
        return Curves.easeInOut;
    }
  }

  static SliverGridDelegate gridDelegate(dynamic v) {
    if (v is Map) {
      final m = Map<String, dynamic>.from(v);
      final String? type = m['type']?.toString();
      if (type == 'fixedCrossAxisCount' || m['crossAxisCount'] != null) {
        return SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: (m['crossAxisCount'] as num?)?.toInt() ?? 2,
          mainAxisSpacing: (m['mainAxisSpacing'] as num?)?.toDouble() ?? 0.0,
          crossAxisSpacing: (m['crossAxisSpacing'] as num?)?.toDouble() ?? 0.0,
          childAspectRatio: (m['childAspectRatio'] as num?)?.toDouble() ?? 1.0,
        );
      } else if (type == 'maxCrossAxisExtent' ||
          m['maxCrossAxisExtent'] != null) {
        return SliverGridDelegateWithMaxCrossAxisExtent(
          maxCrossAxisExtent:
              (m['maxCrossAxisExtent'] as num?)?.toDouble() ?? 200.0,
          mainAxisSpacing: (m['mainAxisSpacing'] as num?)?.toDouble() ?? 0.0,
          crossAxisSpacing: (m['crossAxisSpacing'] as num?)?.toDouble() ?? 0.0,
          childAspectRatio: (m['childAspectRatio'] as num?)?.toDouble() ?? 1.0,
        );
      }
    }
    return const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2);
  }

  static IconData iconData(String? name) {
    switch (name) {
      case 'notifications':
        return Icons.notifications;
      case 'account_balance_wallet':
        return Icons.account_balance_wallet;
      case 'swap_horiz':
        return Icons.swap_horiz;
      case 'payments':
        return Icons.payments;
      case 'qr_code_scanner':
        return Icons.qr_code_scanner;
      case 'history':
        return Icons.history;
      case 'pie_chart':
        return Icons.pie_chart;
      case 'show_chart':
        return Icons.show_chart;
      case 'assessment':
        return Icons.assessment;
      case 'psychology':
        return Icons.psychology;
      case 'info':
        return Icons.info;
      case 'bar_chart':
        return Icons.bar_chart;
      case 'add':
        return Icons.add;
      case 'trending_up':
        return Icons.trending_up;
      case 'trending_down':
        return Icons.trending_down;
      case 'arrow_back':
        return Icons.arrow_back;
      case 'search':
        return Icons.search;
      case 'more_vert':
        return Icons.more_vert;
      case 'star':
        return Icons.star;
      case 'settings':
        return Icons.settings;
      case 'person':
        return Icons.person;
      case 'home':
        return Icons.home;
      case 'favorite':
        return Icons.favorite;
      case 'share':
        return Icons.share;
      case 'error_outline':
        return Icons.error_outline;
      default:
        return Icons.circle;
    }
  }
}
