import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:fuickjs_flutter/core/logger.dart';
import 'package:fuickjs_flutter/offline/config/offline_config.dart';
import 'package:fuickjs_flutter/offline/offline.dart';

/// Demo App 的 bundle 动态下发配置与初始化。
class DemoOfflineBootstrap {
  static const _pubKeyAsset = 'assets/js/bundle_signing_pub.b64';

  /// 与 pack-all.js --keyId 一致；写入各 zip 内 manifest.json，验签时选公钥。
  static const signingKeyId = 'demo-key';

  /// App 版本，与 pubspec.yaml version 对齐。
  static const appVersion = '1.0.0';

  static Future<void> init() async {
    final pubB64 = await _loadPublicKeyB64();

    await Offline.init(
      OfflineConfig(
        envGetter: () => kDebugMode ? 'debug' : 'release',
        appVersionGetter: () => appVersion,
        signaturePublicKeysB64: {signingKeyId: pubB64},
        offlinePackagesGetter: _fetchRemotePackages,
        offlineConfigGetter: () async => null,
        debug: kDebugMode,
        logger: (tag, msg) => logger.d('[$tag] $msg'),
      ),
    );
  }

  /// 远程 bundle 元数据。Demo 默认无 CDN，返回 null 仅走内置包。
  /// 联调时可改为请求真实接口，格式见 bundle-delivery.md。
  static Future<Map<String, dynamic>?> _fetchRemotePackages() async {
    return null;
  }

  static Future<String> _loadPublicKeyB64() async {
    return (await rootBundle.loadString(_pubKeyAsset, cache: false)).trim();
  }
}
