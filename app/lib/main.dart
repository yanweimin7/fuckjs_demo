// 平台化入口：native（Android/iOS/macOS/…）走 main_native.dart，
// Web 走 main_web.dart。两者各自只编译对应目标，互不引入对端专属依赖。
export 'main_native.dart' if (dart.library.html) 'main_web.dart';
