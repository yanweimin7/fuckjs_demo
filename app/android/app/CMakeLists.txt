cmake_minimum_required(VERSION 3.10)
project(quickjs_ffi C)

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -O2 -fPIC")

# Paths to native sources in the repository
set(QJS_ROOT "${CMAKE_CURRENT_SOURCE_DIR}/../../../src/main/jni/quickjs")
set(FFI_SRC "${CMAKE_CURRENT_SOURCE_DIR}/../../../src/main/jni/quickjs_ffi.c")

add_library(quickjs_ffi SHARED
    ${FFI_SRC}
    ${QJS_ROOT}/quickjs.c
    ${QJS_ROOT}/libregexp.c
    ${QJS_ROOT}/libunicode.c
    ${QJS_ROOT}/dtoa.c
    ${QJS_ROOT}/cutils.c
)

target_include_directories(quickjs_ffi PRIVATE ${QJS_ROOT})
target_link_libraries(quickjs_ffi m log)
