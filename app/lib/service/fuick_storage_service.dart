import 'dart:convert';
import 'dart:io';

import 'package:flutter/services.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:fuickjs_flutter/core/service/base_fuick_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

class FuickStorageService extends BaseFuickService {
  final _storage = const FlutterSecureStorage(
    mOptions: MacOsOptions(
      groupId: null,
      accessibility: KeychainAccessibility.first_unlock,
    ),
    aOptions: AndroidOptions(
      resetOnError: true,
    ),
  );

  bool _useFallback = Platform.isMacOS;

  @override
  String get name => "Storage";

  FuickStorageService() {
    registerAsyncMethod('setItem', (args) async {
      if (args is Map) {
        final key = args['key'];
        final value = args['value'];
        if (key is String && value != null) {
          String valueStr;
          if (value is String) {
            valueStr = value;
          } else {
            valueStr = jsonEncode(value);
          }

          if (_useFallback) {
            final prefs = await SharedPreferences.getInstance();
            await prefs.setString(key, valueStr);
            return true;
          }

          try {
            await _storage.write(key: key, value: valueStr);
          } catch (e) {
            if (e is PlatformException && e.code == '-34018') {
              print(
                  "WARNING: Secure Storage failed (-34018). Falling back to SharedPreferences (INSECURE).");
              _useFallback = true;
              final prefs = await SharedPreferences.getInstance();
              await prefs.setString(key, valueStr);
            } else {
              rethrow;
            }
          }
          return true;
        }
      }
      return false;
    });

    registerAsyncMethod('getItem', (args) async {
      if (args is Map) {
        final key = args['key'];
        if (key is String) {
          String? value;

          if (_useFallback) {
            final prefs = await SharedPreferences.getInstance();
            value = prefs.getString(key);
          } else {
            try {
              value = await _storage.read(key: key);
            } catch (e) {
              if (e is PlatformException && e.code == '-34018') {
                print(
                    "WARNING: Secure Storage failed (-34018). Falling back to SharedPreferences (INSECURE).");
                _useFallback = true;
                final prefs = await SharedPreferences.getInstance();
                value = prefs.getString(key);
              } else {
                _useFallback = true;
                final prefs = await SharedPreferences.getInstance();
                value = prefs.getString(key);
              }
            }
          }

          if (value != null) {
            try {
              return jsonDecode(value);
            } catch (e) {
              return value;
            }
          }
        }
      }
      return null;
    });

    registerAsyncMethod('removeItem', (args) async {
      if (args is Map) {
        final key = args['key'];
        if (key is String) {
          if (_useFallback) {
            final prefs = await SharedPreferences.getInstance();
            await prefs.remove(key);
            return true;
          }

          try {
            await _storage.delete(key: key);
          } catch (e) {
            if (e is PlatformException && e.code == '-34018') {
              _useFallback = true;
              final prefs = await SharedPreferences.getInstance();
              await prefs.remove(key);
            } else {
              rethrow;
            }
          }
          return true;
        }
      }
      return false;
    });

    registerAsyncMethod('hasItem', (args) async {
      if (args is Map) {
        final key = args['key'];
        if (key is String) {
          if (_useFallback) {
            final prefs = await SharedPreferences.getInstance();
            return prefs.containsKey(key);
          }
          try {
            final value = await _storage.read(key: key);
            return value != null;
          } catch (e) {
            if (e is PlatformException && e.code == '-34018') {
              _useFallback = true;
              final prefs = await SharedPreferences.getInstance();
              return prefs.containsKey(key);
            }
            return false;
          }
        }
      }
      return false;
    });
  }
}
