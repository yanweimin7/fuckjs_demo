import 'dart:convert';

import 'package:flutter/services.dart';

/// demo 首页网格里一个可打开的应用入口。
///
/// 与框架的 `offline` 包模型（`Package`）刻意分开：那边要 `sha256` 等完整性
/// 字段，而这里只需要 UI 展示用的 [label] 与首屏路由 [initialRoute]。
class BundleConfig {
  final String name;
  final String label;
  final String initialRoute;

  const BundleConfig({
    required this.name,
    required this.label,
    required this.initialRoute,
  });

  factory BundleConfig.fromJson(Map<String, dynamic> json) => BundleConfig(
        name: json['name'] as String,
        label: json['label'] as String? ?? json['name'] as String,
        initialRoute: json['initialRoute'] as String? ?? '/',
      );
}

/// 读 `assets/js/bundles.json` 里的应用清单。
///
/// native / web 两个入口共用这一份 —— 它曾经在 `main_native.dart` 和
/// `main_web.dart` 里各写了一遍，加个字段就得记得改两处。
Future<List<BundleConfig>> loadBundleConfigs() async {
  final raw = await rootBundle.loadString('assets/js/bundles.json');
  final decoded = jsonDecode(raw);
  // 新格式：{ "packages": [ { "name", "label", "initialRoute", ... } ] }
  // 兼容旧格式：[ { "name", "label", ... } ]
  final List<dynamic> list;
  if (decoded is Map<String, dynamic>) {
    list = decoded['packages'] as List<dynamic>? ?? [];
  } else if (decoded is List<dynamic>) {
    list = decoded;
  } else {
    return [];
  }
  return list
      .map((e) => BundleConfig.fromJson(e as Map<String, dynamic>))
      .toList();
}
