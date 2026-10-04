import 'package:flutter/foundation.dart';
import 'package:fuickjs_flutter/core/logger.dart';
import 'package:fuickjs_flutter/offline/config/offline_config.dart';

/// Demo App 的 bundle 动态下发配置。
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
      'ulBqCbzVkEX2iMsxgiFB0AJxR/WLEh0e6E2FZZEnEdI=';

  /// 构造配置交给 `FuickJS.init(offline: ...)` —— 由框架在后台启动，
  /// 宿主不必（也不该）在这里 await。
  static OfflineConfig config() => OfflineConfig(
        envGetter: () => kDebugMode ? 'debug' : 'release',
        signaturePublicKeysB64: {signingKeyId: signingPubB64},
        // 包校验开关：默认 true（Ed25519 签名 + 逐代码文件 SHA-256）。
        // 内部测试 / 无签名基础设施时可置 false，跳过代码层验签但保留整包 zip SHA-256。
        // 注意 release 构建下置 false 会让 Offline.init 直接抛错——它和
        // allowUnsignedRemoteMetadata 一样，任一打开都足以打穿 bundle 信任链。
        // 这道闸由框架在分派 init 之前**同步**校验，所以误配仍会在启动时直接抛。
        enableSignatureVerify: true,
        // 远程包下载进度回调（可选）：(name, progress) → 0.0~1.0，1.0=完成，-1.0=失败/取消。
        // 内置包无下载进度。也可用 Offline.getDownloadProgress(name) 轮询查询。
        onDownloadProgress: (name, progress) => logger.d('[$name] download $progress'),
        // 强制更新前征询用户（可选）：发现 mustBeUpdated 新版本、下载之前调用。
        // 返回 true 同意进入下载；返回 false 拒绝，直接用本地已生效包。
        // 未配置视为同意。demo 无远程包不会触发，接入真实 CDN 时在此弹框。
        onForcedUpdateConfirm: (name, version) async {
          logger.d('[$name] forced update to $version, asking user...');
          return true; // 示例：恒同意；真实接入改为弹框并返回用户选择。
        },
        // P0-5：远程 latest.json 必须 Ed25519 签名。本 demo 默认无 CDN，
        // _fetchRemotePackages 返回 null，不走签名校验路径。
        offlinePackagesGetter: _fetchRemotePackages,
        offlineConfigGetter: () async => null,
        debug: kDebugMode,
        logger: (tag, msg) => logger.d('[$tag] $msg'),
      );

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
