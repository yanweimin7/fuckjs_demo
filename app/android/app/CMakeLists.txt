cmake_minimum_required(VERSION 3.10)
project(quickjs_ffi C)

set(CMAKE_C_STANDARD 11)

# QuickJS-NG 优化策略
# - ng 上游 CMake Release 模式默认是 -O3 -DNDEBUG(见 quickjs/CMakeLists.txt:75-78)
# - 我们这里手动指定,与上游默认值对齐(避免 -O2 损失 10-30% 性能)
# - -fomit-frame-pointer 释放一个寄存器,与 O3 搭配是 ng 社区推荐组合
# - 旧版 QuickJS(bellard 时代)用 -O2 是稳妥选择,ng 时代已不适用
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -O3 -fomit-frame-pointer -fPIC")

# Paths to native sources in the repository
# CMakeLists.txt 位置:fuickjs_demo/app/android/app/CMakeLists.txt
# 目标:fuickjs_engine/src/main/jni/vendor/quickjs/ → 需要 4 层 ../
set(QJS_ROOT "${CMAKE_CURRENT_SOURCE_DIR}/../../../../fuickjs_engine/src/main/jni/vendor/quickjs")
set(FFI_SRC "${CMAKE_CURRENT_SOURCE_DIR}/../../../../fuickjs_engine/src/main/jni/quickjs_ffi.c")

# 源文件 glob 自 ${QJS_ROOT},排除 CLI/fuzz/test/hosted-only 文件
# 上游 QuickJS-NG 加新 .c 文件(例如 libbigint.c)无需同步这里
# 与 build_*.sh 中的 QJS_EXCLUDE_REGEX 保持一致
set(_QJS_EXCLUDE
    qjs.c
    qjsc.c
    qjs-wasi.c
    qjs-wasi-reactor.c
    qjs-debugger.c
    qjs-debugserver.c
    ctest.c
    cxxtest.c
    fuzz.c
    run-test262.c
    unicode_gen.c
    api-test.c
    lre-test.c
    standalone.c
)

file(GLOB _QJS_SRCS "${QJS_ROOT}/*.c")
foreach(_excluded IN LISTS _QJS_EXCLUDE)
    list(REMOVE_ITEM _QJS_SRCS "${QJS_ROOT}/${_excluded}")
endforeach()

if(NOT _QJS_SRCS)
    message(FATAL_ERROR
        "[quickjs_ffi] No QuickJS source files found in ${QJS_ROOT}. "
        "Did you run 'cd fuickjs_engine && ./build.sh update'?")
endif()

message(STATUS "[quickjs_ffi] qjs_sources:")
foreach(_src IN LISTS _QJS_SRCS)
    message(STATUS "  - ${_src}")
endforeach()

add_library(quickjs_ffi SHARED
    ${FFI_SRC}
    ${_QJS_SRCS}
)

target_include_directories(quickjs_ffi PRIVATE ${QJS_ROOT})
target_link_libraries(quickjs_ffi m log)
