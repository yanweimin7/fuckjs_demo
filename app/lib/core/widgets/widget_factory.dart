import 'package:flutter/material.dart';

class WidgetFactory {
  final void Function(String call, dynamic args) onAction;

  WidgetFactory({required this.onAction});

  Widget build(Map<String, dynamic> node) {
    final type = node['type'] as String? ?? 'Text';
    final props = Map<String, dynamic>.from(node['props'] as Map? ?? {});
    final children = (node['children'] as List?)
            ?.map((e) => Map<String, dynamic>.from(e as Map))
            .toList() ??
        const [];
    switch (type) {
      case 'Column':
        return _wrapPadding(
          props,
          Column(
            mainAxisAlignment: _mainAxis(props['mainAxisAlignment'] as String?),
            crossAxisAlignment: _crossAxis(
              props['crossAxisAlignment'] as String?,
            ),
            mainAxisSize: _mainAxisSize(props['mainAxisSize'] as String?),
            children: children.map(build).toList(),
          ),
        );
      case 'Row':
        return _wrapPadding(
          props,
          Row(
            mainAxisAlignment: _mainAxis(props['mainAxisAlignment'] as String?),
            crossAxisAlignment: _crossAxis(
              props['crossAxisAlignment'] as String?,
            ),
            mainAxisSize: _mainAxisSize(props['mainAxisSize'] as String?),
            children: children.map(build).toList(),
          ),
        );
      case 'Container':
        return _wrapMarginAndPadding(
          props,
          Container(
            width: _sizeNum(props['width']),
            height: _sizeNum(props['height']),
            alignment: _alignment(props['alignment'] as String?),
            decoration: _boxDecorationFromProps(props),
            child: children.isEmpty
                ? const SizedBox.shrink()
                : build(children.first),
          ),
        );
      case 'Button':
        final text = (props['text'] ?? '') as String;
        final onTapJs = props['onTapJs'] as Map?;
        final onTapEventId = props['onTapEventId'] as String?;
        final onTapPayload = props['onTapPayload'];
        return _wrapPadding(
          props,
          ElevatedButton(
            onPressed: () {
              if (onTapEventId != null && onTapEventId.isNotEmpty) {
                onAction(
                    '__event', {'id': onTapEventId, 'payload': onTapPayload});
              } else if (onTapJs != null) {
                onAction(
                  (onTapJs['call'] ?? '') as String,
                  onTapJs['args'],
                );
              }
            },
            child: Text(text),
          ),
        );
      case 'TextField':
        final hint = (props['hint'] ?? '') as String;
        final onChangedJs = props['onChangedJs'] as Map?;
        final onSubmittedJs = props['onSubmittedJs'] as Map?;
        final onChangedEventId = props['onChangedEventId'] as String?;
        final onSubmittedEventId = props['onSubmittedEventId'] as String?;
        return _wrapPadding(
          props,
          TextField(
            decoration: InputDecoration(hintText: hint),
            onChanged: (v) {
              if (onChangedEventId != null && onChangedEventId.isNotEmpty) {
                onAction('__event', {
                  'id': onChangedEventId,
                  'payload': {'value': v}
                });
              } else if (onChangedJs != null) {
                final args = Map<String, dynamic>.from(
                  onChangedJs['args'] as Map? ?? {},
                );
                args['value'] = v;
                onAction((onChangedJs['call'] ?? '') as String, args);
              }
            },
            onSubmitted: (v) {
              if (onSubmittedEventId != null && onSubmittedEventId.isNotEmpty) {
                onAction('__event', {
                  'id': onSubmittedEventId,
                  'payload': {'value': v}
                });
              } else if (onSubmittedJs != null) {
                final args = Map<String, dynamic>.from(
                  onSubmittedJs['args'] as Map? ?? {},
                );
                args['value'] = v;
                onAction((onSubmittedJs['call'] ?? '') as String, args);
              }
            },
          ),
        );
      case 'Switch':
        final v = props['value'] == true;
        final onChangedJs = props['onChangedJs'] as Map?;
        final onChangedEventId = props['onChangedEventId'] as String?;
        return _wrapPadding(
          props,
          Switch(
            value: v,
            onChanged: (nv) {
              if (onChangedEventId != null && onChangedEventId.isNotEmpty) {
                onAction('__event', {
                  'id': onChangedEventId,
                  'payload': {'value': nv}
                });
              } else if (onChangedJs != null) {
                final args = Map<String, dynamic>.from(
                  onChangedJs['args'] as Map? ?? {},
                );
                args['value'] = nv;
                onAction((onChangedJs['call'] ?? '') as String, args);
              }
            },
          ),
        );
      case 'Image':
        final url = (props['url'] ?? '') as String;
        final fit = _boxFit(props['fit'] as String?);
        final borderRadius = _borderRadius(props['borderRadius']);
        Widget image = Image.network(
          url,
          width: _sizeNum(props['width']),
          height: _sizeNum(props['height']),
          fit: fit,
          errorBuilder: (context, error, stackTrace) {
            return Container(
              width: _sizeNum(props['width']),
              height: _sizeNum(props['height']),
              color: Colors.grey[300],
              child: const Icon(Icons.error_outline),
            );
          },
        );
        if (borderRadius != null) {
          image = ClipRRect(borderRadius: borderRadius, child: image);
        }
        return _wrapPadding(props, image);
      case 'Padding':
        return Padding(
          padding: _edgeInsets(props['padding']) ?? EdgeInsets.zero,
          child: children.isEmpty
              ? const SizedBox.shrink()
              : build(children.first),
        );
      case 'SizedBox':
        return SizedBox(
          width: _sizeNum(props['width']),
          height: _sizeNum(props['height']),
          child: children.isEmpty ? null : build(children.first),
        );
      case 'Divider':
        return Divider(
          height: _sizeNum(props['height']),
          thickness: _sizeNum(props['thickness']),
          color: _colorFromHex(props['color'] as String?),
          indent: _sizeNum(props['indent']),
          endIndent: _sizeNum(props['endIndent']),
        );
      case 'SingleChildScrollView':
        return SingleChildScrollView(
          padding: _edgeInsets(props['padding']),
          scrollDirection: _axis(props['scrollDirection'] as String?),
          child: children.isEmpty
              ? const SizedBox.shrink()
              : build(children.first),
        );
      case 'Icon':
        final cp = props['codePoint'] is num
            ? (props['codePoint'] as num).toInt()
            : null;
        final color = _colorFromHex(props['color'] as String?);
        final size = _sizeNum(props['size']);
        final data = cp == null
            ? Icons.circle
            : IconData(cp, fontFamily: 'MaterialIcons');
        return _wrapPadding(props, Icon(data, color: color, size: size));
      case 'ListView':
        return _wrapPadding(
          props,
          ListView(
            shrinkWrap: true,
            padding: _edgeInsets(props['padding']),
            scrollDirection: _axis(props['scrollDirection'] as String?),
            children: children.map(build).toList(),
          ),
        );
      case 'Stack':
        return _wrapPadding(
          props,
          Stack(
            alignment: _stackAlignment(props['alignment'] as String?),
            children: children.map(build).toList(),
          ),
        );
      case 'Positioned':
        return Positioned(
          left: _sizeNum(props['left']),
          top: _sizeNum(props['top']),
          right: _sizeNum(props['right']),
          bottom: _sizeNum(props['bottom']),
          width: _sizeNum(props['width']),
          height: _sizeNum(props['height']),
          child: children.isEmpty
              ? const SizedBox.shrink()
              : build(children.first),
        );
      case 'Opacity':
        final opacity = (props['opacity'] is num)
            ? (props['opacity'] as num).toDouble()
            : 1.0;
        return Opacity(
          opacity: opacity,
          child: children.isEmpty
              ? const SizedBox.shrink()
              : build(children.first),
        );
      case 'Center':
        return Center(
          child: children.isEmpty
              ? const SizedBox.shrink()
              : build(children.first),
        );
      case 'Expanded':
        final flex =
            (props['flex'] is num) ? (props['flex'] as num).toInt() : 1;
        return Expanded(
          flex: flex,
          child: children.isEmpty
              ? const SizedBox.shrink()
              : build(children.first),
        );
      case 'Flexible':
        final flex =
            (props['flex'] is num) ? (props['flex'] as num).toInt() : 1;
        return Flexible(
          flex: flex,
          child: children.isEmpty
              ? const SizedBox.shrink()
              : build(children.first),
        );
      case 'GestureDetector':
      case 'InkWell':
        final onTapJs = props['onTapJs'] as Map?;
        final onTapEventId = props['onTapEventId'] as String?;
        final onTapPayload = props['onTapPayload'];
        final widget =
            children.isEmpty ? const SizedBox.shrink() : build(children.first);
        final callback = () {
          if (onTapEventId != null && onTapEventId.isNotEmpty) {
            onAction('__event', {'id': onTapEventId, 'payload': onTapPayload});
          } else if (onTapJs != null) {
            onAction((onTapJs['call'] ?? '') as String, onTapJs['args']);
          }
        };
        if (type == 'InkWell') {
          return InkWell(onTap: callback, child: widget);
        }
        return GestureDetector(onTap: callback, child: widget);
      case 'CircularProgressIndicator':
        final color = _colorFromHex(props['color'] as String?);
        final strokeWidth = (props['strokeWidth'] is num)
            ? (props['strokeWidth'] as num).toDouble()
            : 4.0;
        return _wrapPadding(
          props,
          CircularProgressIndicator(
            valueColor: color != null ? AlwaysStoppedAnimation(color) : null,
            strokeWidth: strokeWidth,
          ),
        );
      case 'Text':
      default:
        final text = (props['text'] ?? '') as String;
        final fontSize = (props['fontSize'] is num)
            ? (props['fontSize'] as num).toDouble()
            : null;
        final color = _colorFromHex(props['color'] as String?);
        return _wrapPadding(
          props,
          Text(
            text,
            style: TextStyle(fontSize: fontSize, color: color),
          ),
        );
    }
  }

  Widget _wrapPadding(Map<String, dynamic> props, Widget child) {
    final p = props['padding'];
    if (p is num) {
      return Padding(padding: EdgeInsets.all(p.toDouble()), child: child);
    }
    final ei = _edgeInsets(p);
    if (ei != null) {
      return Padding(padding: ei, child: child);
    }
    return child;
  }

  Widget _wrapMarginAndPadding(Map<String, dynamic> props, Widget child) {
    final margin = _edgeInsets(props['margin']);
    final padding = _edgeInsets(props['padding']);
    Widget c = child;
    if (padding != null) {
      c = Padding(padding: padding, child: c);
    }
    if (margin != null) {
      c = Padding(padding: margin, child: c);
    }
    return c;
  }

  MainAxisAlignment _mainAxis(String? v) {
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

  CrossAxisAlignment _crossAxis(String? v) {
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

  MainAxisSize _mainAxisSize(String? v) {
    switch (v) {
      case 'min':
        return MainAxisSize.min;
      case 'max':
      default:
        return MainAxisSize.max;
    }
  }

  Alignment? _alignment(String? v) {
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

  Axis _axis(String? v) {
    switch (v) {
      case 'horizontal':
        return Axis.horizontal;
      case 'vertical':
      default:
        return Axis.vertical;
    }
  }

  BoxFit? _boxFit(String? v) {
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

  Alignment _stackAlignment(String? v) {
    return _alignment(v) ?? Alignment.center;
  }

  double? _sizeNum(dynamic v) {
    if (v is num) return v.toDouble();
    return null;
  }

  EdgeInsets? _edgeInsets(dynamic v) {
    if (v is num) return EdgeInsets.all(v.toDouble());
    if (v is Map) {
      final m = Map<String, dynamic>.from(v);
      return EdgeInsets.only(
        left: (m['left'] is num) ? (m['left'] as num).toDouble() : 0,
        top: (m['top'] is num) ? (m['top'] as num).toDouble() : 0,
        right: (m['right'] is num) ? (m['right'] as num).toDouble() : 0,
        bottom: (m['bottom'] is num) ? (m['bottom'] as num).toDouble() : 0,
      );
    }
    return null;
  }

  Color? _colorFromHex(String? hex) {
    if (hex == null || hex.isEmpty) return null;
    final s = hex.replaceFirst('#', '');
    final v = int.tryParse(s, radix: 16);
    if (v == null) return null;
    if (s.length <= 6) {
      return Color(0xFF000000 | v);
    }
    return Color(v);
  }

  BoxDecoration? _boxDecorationFromProps(Map<String, dynamic> props) {
    final color = _colorFromHex(props['color'] as String?);
    final borderRadius = _borderRadius(props['borderRadius']);
    final border = _border(props['border']);
    if (color == null && borderRadius == null && border == null) return null;
    return BoxDecoration(
      color: color,
      borderRadius: borderRadius,
      border: border,
    );
  }

  Border? _border(dynamic v) {
    if (v is Map) {
      final m = Map<String, dynamic>.from(v);
      final color = _colorFromHex(m['color'] as String?) ?? Colors.black;
      final width = _sizeNum(m['width']) ?? 1.0;
      return Border.all(color: color, width: width);
    }
    return null;
  }

  BorderRadius? _borderRadius(dynamic br) {
    if (br is num) {
      return BorderRadius.circular(br.toDouble());
    } else if (br is Map) {
      final m = Map<String, dynamic>.from(br);
      return BorderRadius.only(
        topLeft: Radius.circular(_sizeNum(m['topLeft']) ?? 0),
        topRight: Radius.circular(_sizeNum(m['topRight']) ?? 0),
        bottomLeft: Radius.circular(_sizeNum(m['bottomLeft']) ?? 0),
        bottomRight: Radius.circular(_sizeNum(m['bottomRight']) ?? 0),
      );
    }
    return null;
  }
}
