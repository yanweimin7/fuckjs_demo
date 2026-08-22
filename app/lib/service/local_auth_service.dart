import 'dart:convert';
import 'dart:io';
import 'dart:isolate';
import 'dart:math';
import 'dart:typed_data';

import 'package:encrypt/encrypt.dart' as encrypt;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:fuickjs_flutter/core/service/base_fuick_service.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:local_auth/local_auth.dart';
import 'package:pointycastle/key_derivators/api.dart';
import 'package:pointycastle/key_derivators/argon2.dart';

class EncryptedData {
  final String ciphertext;
  final String iv;
  final String tag;

  EncryptedData({
    required this.ciphertext,
    required this.iv,
    required this.tag,
  });

  Map<String, dynamic> toJson() => {
        'ciphertext': ciphertext,
        'iv': iv,
        'tag': tag,
      };

  factory EncryptedData.fromJson(Map<String, dynamic> json) => EncryptedData(
        ciphertext: json['ciphertext'] as String,
        iv: json['iv'] as String,
        tag: json['tag'] as String,
      );

  String toBase64() => base64Encode(utf8.encode(jsonEncode(toJson())));

  factory EncryptedData.fromBase64(String base64Str) {
    final jsonStr = utf8.decode(base64Decode(base64Str));
    final json = jsonDecode(jsonStr) as Map<String, dynamic>;
    return EncryptedData.fromJson(json);
  }
}

class KeyProtection {
  final EncryptedData encryptedData;
  final String? salt;
  final String? hardwareKey;
  final ProtectionType type;

  KeyProtection.password({
    required this.encryptedData,
    required this.salt,
  })  : hardwareKey = null,
        type = ProtectionType.password;

  KeyProtection.biometric({
    required this.encryptedData,
    required this.hardwareKey,
  })  : salt = null,
        type = ProtectionType.biometric;
}

enum ProtectionType { password, biometric }

class _Argon2Params {
  final String password;
  final String salt;
  final SendPort sendPort;

  _Argon2Params({
    required this.password,
    required this.salt,
    required this.sendPort,
  });
}

void _deriveKeyWithArgon2InIsolate(_Argon2Params params) {
  final passwordBytes = utf8.encode(params.password);
  final saltBytes = base64Decode(params.salt);

  final argon2 = Argon2BytesGenerator()
    ..init(Argon2Parameters(
      Argon2Parameters.ARGON2_id,
      saltBytes,
      desiredKeyLength: 32,
      iterations: 3,
      memory: 65536,
      lanes: 4,
    ));

  final result = argon2.process(Uint8List.fromList(passwordBytes));
  params.sendPort.send(base64Encode(result));
}

class LocalAuthService extends BaseFuickService {
  @override
  String get name => "LocalAuth";

  final LocalAuthentication _auth = LocalAuthentication();
  final _storage = const FlutterSecureStorage();

  static const _passwordProtectedKey = 'fuick_wallet_pw_key_v8';
  static const _biometricProtectedKey = 'fuick_wallet_bio_key_v8';
  static const _biometricHardwareKey = 'fuick_wallet_bio_hw_key_v8';
  static const _saltKey = 'fuick_wallet_salt_v8';

  AndroidOptions _getAndroidOptions() => const AndroidOptions(
        resetOnError: false,
      );

  IOSOptions _getIOSOptions() => const IOSOptions(
        accessibility: KeychainAccessibility.first_unlock_this_device,
      );

  /// macOS 上让钥匙材料（salt / 受保护 encryptionKey / 生物识别 key）
  /// 与 FuickStorageService 保持一致走 plist(SharedPreferences) 兜底，
  /// 而非依赖钥匙串，保证跨设备/环境行为一致。
  /// 非 macOS 仍优先写钥匙串，钥匙串异常时自动降级到 plist。
  bool _useFallback = Platform.isMacOS;

  Future<String?> _readSecure(String key) async {
    if (_useFallback) {
      final prefs = await SharedPreferences.getInstance();
      var value = prefs.getString(key);
      if (value == null) {
        // 迁移：尝试从钥匙串恢复旧数据（系统密码变更前写入的）
        try {
          value = await _storage.read(
            key: key,
            iOptions: _getIOSOptions(),
            aOptions: _getAndroidOptions(),
          );
        } catch (e) {
          print('[LocalAuth] keychain read during migration failed: $e');
        }
        if (value != null) {
          await prefs.setString(key, value);
          print('[LocalAuth] migrated $key from keychain to plist');
        }
      }
      return value;
    }
    try {
      return await _storage.read(
        key: key,
        iOptions: _getIOSOptions(),
        aOptions: _getAndroidOptions(),
      );
    } catch (e) {
      print('[LocalAuth] secure read failed, falling back to prefs: $e');
      _useFallback = true;
      final prefs = await SharedPreferences.getInstance();
      return prefs.getString(key);
    }
  }

  Future<void> _writeSecure(String key, String value) async {
    if (_useFallback) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(key, value);
      return;
    }
    try {
      await _storage.write(
        key: key,
        value: value,
        iOptions: _getIOSOptions(),
        aOptions: _getAndroidOptions(),
      );
    } catch (e) {
      print('[LocalAuth] secure write failed, falling back to prefs: $e');
      _useFallback = true;
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(key, value);
    }
  }

  Future<void> _deleteSecure(String key) async {
    if (_useFallback) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(key);
      return;
    }
    try {
      await _storage.delete(
        key: key,
        iOptions: _getIOSOptions(),
        aOptions: _getAndroidOptions(),
      );
    } catch (e) {
      print('[LocalAuth] secure delete failed, falling back to prefs: $e');
      _useFallback = true;
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(key);
    }
  }

  Future<bool> _containsSecure(String key) async {
    final value = await _readSecure(key);
    return value != null;
  }

  String _generateSalt() {
    final random = Random.secure();
    final bytes = Uint8List(32);
    for (var i = 0; i < 32; i++) {
      bytes[i] = random.nextInt(256);
    }
    return base64Encode(bytes);
  }

  String _generateIV() {
    final random = Random.secure();
    final bytes = Uint8List(12);
    for (var i = 0; i < 12; i++) {
      bytes[i] = random.nextInt(256);
    }
    return base64Encode(bytes);
  }

  Future<String> _deriveKeyWithArgon2(String password, String salt) async {
    final receivePort = ReceivePort();

    await Isolate.spawn(
      _deriveKeyWithArgon2InIsolate,
      _Argon2Params(
        password: password,
        salt: salt,
        sendPort: receivePort.sendPort,
      ),
    );

    final result = await receivePort.first as String;
    return result;
  }

  EncryptedData _aesEncrypt(String plaintext, String key) {
    final keyBytes = base64Decode(key);
    final iv = _generateIV();
    final ivBytes = base64Decode(iv);

    final keyData = Uint8List(32);
    for (var i = 0; i < 32 && i < keyBytes.length; i++) {
      keyData[i] = keyBytes[i];
    }

    final encrypter = encrypt.Encrypter(
      encrypt.AES(
        encrypt.Key(keyData),
        mode: encrypt.AESMode.gcm,
      ),
    );

    final encrypted = encrypter.encrypt(
      plaintext,
      iv: encrypt.IV(ivBytes),
    );

    final encryptedBytes = encrypted.bytes;
    final ciphertextLength = encryptedBytes.length - 16;

    final ciphertext = base64Encode(
      encryptedBytes.sublist(0, ciphertextLength),
    );
    final tag = base64Encode(
      encryptedBytes.sublist(ciphertextLength),
    );

    return EncryptedData(
      ciphertext: ciphertext,
      iv: iv,
      tag: tag,
    );
  }

  String _aesDecrypt(EncryptedData encryptedData, String key) {
    final keyBytes = base64Decode(key);
    final ivBytes = base64Decode(encryptedData.iv);

    final keyData = Uint8List(32);
    for (var i = 0; i < 32 && i < keyBytes.length; i++) {
      keyData[i] = keyBytes[i];
    }

    final ciphertextBytes = base64Decode(encryptedData.ciphertext);
    final tagBytes = base64Decode(encryptedData.tag);
    final combinedBytes = Uint8List(ciphertextBytes.length + tagBytes.length);
    combinedBytes.setAll(0, ciphertextBytes);
    combinedBytes.setAll(ciphertextBytes.length, tagBytes);

    final encrypter = encrypt.Encrypter(
      encrypt.AES(
        encrypt.Key(keyData),
        mode: encrypt.AESMode.gcm,
      ),
    );

    final decrypted = encrypter.decrypt(
      encrypt.Encrypted(combinedBytes),
      iv: encrypt.IV(ivBytes),
    );

    return decrypted;
  }

  KeyProtection _protectEncryptionKey({
    required String encryptionKey,
    required String protectionKey,
    required ProtectionType type,
    String? salt,
  }) {
    final encryptedData = _aesEncrypt(encryptionKey, protectionKey);

    if (type == ProtectionType.password) {
      return KeyProtection.password(
        encryptedData: encryptedData,
        salt: salt!,
      );
    } else {
      return KeyProtection.biometric(
        encryptedData: encryptedData,
        hardwareKey: protectionKey,
      );
    }
  }

  String _unprotectEncryptionKey({
    required KeyProtection protection,
    required String protectionKey,
  }) {
    return _aesDecrypt(protection.encryptedData, protectionKey);
  }

  LocalAuthService() {
    registerAsyncMethod('isBiometricAvailable', (args) async {
      try {
        final canCheck = await _auth.canCheckBiometrics;
        final isSupported = await _auth.isDeviceSupported();
        return (canCheck && isSupported).toString();
      } catch (e) {
        return "false";
      }
    });

    registerAsyncMethod('isPasswordSet', (args) async {
      try {
          final hasSalt = await _containsSecure(_saltKey);
        print('[LocalAuth] isPasswordSet: $_saltKey exists = $hasSalt');
        return hasSalt.toString();
      } catch (e) {
        print('[LocalAuth] isPasswordSet error: $e');
        return "false";
      }
    });

    registerAsyncMethod('initEncryptionKey', (args) async {
      if (args is Map) {
        final password = args['password'] as String;
        print(
            '[LocalAuth] initEncryptionKey: password length = ${password.length}');

        try {
          final encryptionKey = _generateSalt();
          print('[LocalAuth] initEncryptionKey: generated encryptionKey');

          final salt = _generateSalt();
          print('[LocalAuth] initEncryptionKey: generated salt');

          print('[LocalAuth] initEncryptionKey: starting argon2 derive...');
          final protectionKey = await _deriveKeyWithArgon2(password, salt);
          print(
              '[LocalAuth] initEncryptionKey: argon2 derive done, protectionKey length = ${protectionKey.length}');

          print('[LocalAuth] initEncryptionKey: starting aes encrypt...');
          final protection = _protectEncryptionKey(
            encryptionKey: encryptionKey,
            protectionKey: protectionKey,
            type: ProtectionType.password,
            salt: salt,
          );
          print('[LocalAuth] initEncryptionKey: aes encrypt done');

          print('[LocalAuth] initEncryptionKey: writing to storage...');
          await _writeSecure(_saltKey, protection.salt!);
          await _writeSecure(
              _passwordProtectedKey, protection.encryptedData.toBase64());
          print('[LocalAuth] initEncryptionKey: stored salt to $_saltKey');

          return jsonEncode({
            'success': true,
            'encryptionKey': encryptionKey,
          });
        } catch (e, s) {
          print('[LocalAuth] initEncryptionKey ERROR: $e\n$s');
          return jsonEncode({'success': false, 'error': e.toString()});
        }
      }
      return jsonEncode({'success': false, 'error': 'Invalid args'});
    });

    registerAsyncMethod('unlockWithPassword', (args) async {
      if (args is Map) {
        final password = args['password'] as String;

        try {
          final salt = await _readSecure(_saltKey);
          final encryptedDataStr = await _readSecure(_passwordProtectedKey);

          if (salt == null || encryptedDataStr == null) {
            return jsonEncode({'success': false, 'error': 'Key not found'});
          }

          final encryptedData = EncryptedData.fromBase64(encryptedDataStr);
          final protection = KeyProtection.password(
            encryptedData: encryptedData,
            salt: salt,
          );
          final protectionKey = await _deriveKeyWithArgon2(password, salt);
          final encryptionKey = _unprotectEncryptionKey(
            protection: protection,
            protectionKey: protectionKey,
          );

          return jsonEncode({
            'success': true,
            'encryptionKey': encryptionKey,
          });
        } catch (e) {
          return jsonEncode({'success': false, 'error': e.toString()});
        }
      }
      return jsonEncode({'success': false, 'error': 'Invalid args'});
    });

    registerAsyncMethod('enableBiometric', (args) async {
      if (args is Map) {
        final encryptionKey = args['encryptionKey'] as String;

        try {
          final canCheck = await _auth.canCheckBiometrics;
          final isSupported = await _auth.isDeviceSupported();
          print(
              '[LocalAuth] canCheckBiometrics: $canCheck, isDeviceSupported: $isSupported');

          if (!canCheck || !isSupported) {
            return jsonEncode(
                {'success': false, 'error': 'Biometric not available'});
          }

          final availableBiometrics = await _auth.getAvailableBiometrics();
          print('[LocalAuth] availableBiometrics: $availableBiometrics');

          final bool didAuthenticate = await _auth.authenticate(
            localizedReason: 'Authenticate to enable biometric login',
            authMessages: const [],
          );

          print('[LocalAuth] didAuthenticate: $didAuthenticate');

          if (!didAuthenticate) {
            return jsonEncode({'success': false, 'error': 'Auth failed'});
          }

          final hardwareKey = _generateSalt();
          final protection = _protectEncryptionKey(
            encryptionKey: encryptionKey,
            protectionKey: hardwareKey,
            type: ProtectionType.biometric,
          );

          await _writeSecure(
              _biometricProtectedKey, protection.encryptedData.toBase64());
          await _writeSecure(_biometricHardwareKey, protection.hardwareKey!);

          return jsonEncode({'success': true});
        } catch (e) {
          return jsonEncode({'success': false, 'error': e.toString()});
        }
      }
      return jsonEncode({'success': false, 'error': 'Invalid args'});
    });

    registerAsyncMethod('disableBiometric', (args) async {
      await _deleteSecure(_biometricProtectedKey);
      await _deleteSecure(_biometricHardwareKey);
      return jsonEncode({'success': true});
    });

    registerAsyncMethod('isBiometricEnabled', (args) async {
      final hasKey = await _containsSecure(_biometricProtectedKey);
      return hasKey.toString();
    });

    registerAsyncMethod('unlockWithBiometric', (args) async {
      try {
        final hasKey = await _containsSecure(_biometricProtectedKey);

        if (!hasKey) {
          return jsonEncode(
              {'success': false, 'error': 'Biometric not enabled'});
        }

        final bool didAuthenticate = await _auth.authenticate(
          localizedReason: 'Please authenticate to access your wallet',
          authMessages: const [],
        );

        if (!didAuthenticate) {
          return jsonEncode({'success': false, 'error': 'Auth failed'});
        }

        final encryptedDataStr = await _readSecure(_biometricProtectedKey);
        final hardwareKey = await _readSecure(_biometricHardwareKey);

        if (encryptedDataStr == null || hardwareKey == null) {
          return jsonEncode({'success': false, 'error': 'Key not found'});
        }

        final encryptedData = EncryptedData.fromBase64(encryptedDataStr);
        final protection = KeyProtection.biometric(
          encryptedData: encryptedData,
          hardwareKey: hardwareKey,
        );
        final encryptionKey = _unprotectEncryptionKey(
          protection: protection,
          protectionKey: hardwareKey,
        );

        return jsonEncode({
          'success': true,
          'encryptionKey': encryptionKey,
        });
      } catch (e) {
        return jsonEncode({'success': false, 'error': e.toString()});
      }
    });
  }
}
