int asInt(dynamic value) {
  if (value == null) return 0;
  if (value is int) return value;
  if (value is num) return value.toInt();
  if (value is String) return int.tryParse(value) ?? 0;
  return 0;
}

int? asIntOrNull(dynamic value) {
  if (value == null) return null;
  if (value is int) return value;
  if (value is num) return value.toInt();
  if (value is String) return int.tryParse(value);
  return null;
}

double asDouble(dynamic value) {
  if (value == null) return 0.0;
  if (value is double) return value;
  if (value is num) return value.toDouble();
  if (value is String) return double.tryParse(value) ?? 0.0;
  return 0.0;
}

double? asDoubleOrNull(dynamic value) {
  if (value == null) return null;
  if (value is double) return value;
  if (value is num) return value.toDouble();
  if (value is String) return double.tryParse(value);
  return null;
}

extension SafeConvert on Object? {
  int get asInt {
    if (this == null) return 0;
    if (this is int) return this as int;
    if (this is num) return (this as num).toInt();
    if (this is String) return int.tryParse(this as String) ?? 0;
    return 0;
  }

  int? get asIntOrNull {
    if (this == null) return null;
    if (this is int) return this as int;
    if (this is num) return (this as num).toInt();
    if (this is String) return int.tryParse(this as String);
    return null;
  }

  double get asDouble {
    if (this == null) return 0.0;
    if (this is double) return this as double;
    if (this is num) return (this as num).toDouble();
    if (this is String) return double.tryParse(this as String) ?? 0.0;
    return 0.0;
  }

  double? get asDoubleOrNull {
    if (this == null) return null;
    if (this is double) return this as double;
    if (this is num) return (this as num).toDouble();
    if (this is String) return double.tryParse(this as String);
    return null;
  }
}
