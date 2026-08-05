import 'package:flutter/foundation.dart';
import 'package:fuickjs_flutter/core/logger.dart';
import 'package:fuickjs_flutter/offline/config/offline_config.dart';
import 'package:fuickjs_flutter/offline/offline.dart';

/// Demo App 的 bundle 动态下发配置与初始化。
class DemoOfflineBootstrap {
  /// 与 pack-all.js --keyId 一致；写入各 zip 内 manifest.json，验签时选公钥。
  static const signingKeyId = 'demo-key';

  /// Ed25519 bundle 签名公钥（base64 原始 32 字节）。
  ///
  /// 与 `fuickjs_demo/js/tools/bundle/bundle_signing_key.pem` 配对。
  /// 重新生成密钥后必须同步更新此常量 + `signingKeyId`。
  ///
  /// 注意：编译进 APK 后是明文，攻击者可读。但**这不影响安全性**：
  /// Ed25519 公钥本来就是公开的 —— 关键是不能让私钥泄露。
  /// 真正的安全靠：私钥在 CI/开发者侧 + APK 完整性保护（iOS/Android）。
  static const String signingPubB64 =
      '0KH8QOyFNIIVNsDwB/3dkWKNLMYW+PwWU/dkvG4ef5A=';

  /// App 版本，与 pubspec.yaml version 对齐。
  static const appVersion = '1.0.0';

  static Future<void> init() async {
    await Offline.init(
      OfflineConfig(
        envGetter: () => kDebugMode ? 'debug' : 'release',
        appVersionGetter: () => appVersion,
        signaturePublicKeysB64: {signingKeyId: signingPubB64},
        // P0-5：远程 latest.json 必须 Ed25519 签名。本 demo 默认无 CDN，
        // _fetchRemotePackages 返回 null，不走签名校验路径。
        offlinePackagesGetter: _fetchRemotePackages,
        offlineConfigGetter: () async => null,
        debug: kDebugMode,
        logger: (tag, msg) => logger.d('[$tag] $msg'),
      ),
    );
  }

  /// 远程 bundle 元数据。Demo 默认无 CDN，返回 null 仅走内置包。
  /// 联调时可改为请求真实接口，格式见 bundle-delivery.md。
  ///
  /// P0-5：若要返回非 null，必须满足：
  ///   {
  ///     "_sig": "<base64 Ed25519 sig of canonical(rest)>",
  ///     "_kid": "demo-key",
  ///     "packages": [...]
  ///   }
  /// canonical(rest) = sorted-keys JSON of map after stripping _sig/_kid.
  /// 使用 tools/bundle/sign-latest.js 离线生成。
  static Future<Map<String, dynamic>?> _fetchRemotePackages() async {
    return null;
  }
}
