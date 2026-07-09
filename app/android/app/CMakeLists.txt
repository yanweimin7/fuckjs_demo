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
# 目标:fuickjs_engine/src/main/jni/quickjs/ → 需要 4 层 ../
set(QJS_ROOT "${CMAKE_CURRENT_SOURCE_DIR}/../../../../fuickjs_engine/src/main/jni/quickjs")
set(FFI_SRC "${CMAKE_CURRENT_SOURCE_DIR}/../../../../fuickjs_engine/src/main/jni/quickjs_ffi.c")
set(_QJS_CMAKE "${QJS_ROOT}/CMakeLists.txt")

# 层级 1 复用:从上游 CMakeLists.txt 抽取 qjs_sources 列表
# 上游格式:set(qjs_sources\n    file1.c\n    file2.c\n    ...\n)
# 避免源列表在两处维护;加新 .c 文件只改上游,这里自动同步
# 兜底:抽取失败时使用硬编码列表
# 注:用 file(READ) + 手动切行,因 file(STRINGS) 在某些 CMake 版本上行为不一致
file(READ "${_QJS_CMAKE}" _qjs_cmake_content)
# 转义 ; 防止 list 解析,再按 \n 切
string(REPLACE ";" "<<SEMI>>" _qjs_cmake_content "${_qjs_cmake_content}")
string(REPLACE "\n" ";" _qjs_cmake_lines "${_qjs_cmake_content}")

set(_in_sources_block FALSE)
set(_QJS_FILES "")
foreach(_line IN LISTS _qjs_cmake_lines)
    string(REPLACE "<<SEMI>>" ";" _line "${_line}")
    if(_in_sources_block)
        # set() 块结束:遇到单独成行的 )
        string(STRIP "${_line}" _stripped)
        if(_stripped STREQUAL ")")
            set(_in_sources_block FALSE)
        else()
            # 抽取当前行的 .c 文件名
            string(REGEX MATCH "[a-zA-Z_][a-zA-Z0-9_]*\\.c" _file "${_line}")
            if(_file AND EXISTS "${QJS_ROOT}/${_file}")
                list(APPEND _QJS_FILES "${_file}")
            endif()
        endif()
    elseif(_line MATCHES "^set\\(qjs_sources")
        set(_in_sources_block TRUE)
    endif()
endforeach()

# 兜底列表(从 quickjs/CMakeLists.txt:266-271 同步过来,抽取失败时使用)
if(NOT _QJS_FILES)
    message(WARNING
        "[quickjs_ffi] Failed to extract qjs_sources from ${_QJS_CMAKE}, "
        "falling back to hardcoded list. If upstream QuickJS-NG adds new "
        "source files, update the fallback list below.")
    set(_QJS_FILES
        dtoa.c
        libregexp.c
        libunicode.c
        quickjs.c
    )
endif()

message(STATUS "[quickjs_ffi] qjs_sources: ${_QJS_FILES}")

# 拼成绝对路径
set(_QJS_SRCS "")
foreach(_f IN LISTS _QJS_FILES)
    list(APPEND _QJS_SRCS "${QJS_ROOT}/${_f}")
endforeach()

add_library(quickjs_ffi SHARED
    ${FFI_SRC}
    ${_QJS_SRCS}
)

target_include_directories(quickjs_ffi PRIVATE ${QJS_ROOT})
target_link_libraries(quickjs_ffi m log)
