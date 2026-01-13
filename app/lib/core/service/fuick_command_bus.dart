import 'package:flutter/foundation.dart';

typedef FuickCommandListener = void Function(String method, dynamic args);

class FuickCommandBus {
  FuickCommandBus();

  // Map<scopedRefId, Set<listener>>
  final Map<String, Set<FuickCommandListener>> _listeners = {};

  void addListener(String refId, FuickCommandListener listener) {
    _listeners.putIfAbsent(refId, () => {}).add(listener);
  }

  void removeListener(String refId, FuickCommandListener listener) {
    final listeners = _listeners[refId];
    if (listeners != null) {
      listeners.remove(listener);
      if (listeners.isEmpty) {
        _listeners.remove(refId);
      }
    }
  }

  void dispatch(String refId, String method, dynamic args) {
    final listeners = _listeners[refId];
    if (listeners != null) {
      for (final listener in List.from(listeners)) {
        listener(method, args);
      }
    }
  }
}
