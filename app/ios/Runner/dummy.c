#include "quickjs_ffi_public.h"

// This dummy function ensures that the symbols from quickjs_ffi.xcframework
// are linked into the final executable, so that Dart FFI can find them
// via DynamicLibrary.executable().
//
// 在 iOS 上,Linker 默认会 strip 掉 Dart FFI 用到但 OC/Swift 没直接调用的
// C 符号。这里把每个 FFI 导出符号都"取一次地址",确保它们被保留进 binary。
// dummy_keep_symbols() 本身不会被调用,仅作为符号引用占位。

typedef void (*QjsVoidFn)(void);

// 所有 FFI 导出符号的统一数组(运行时不可达,纯静态引用)。
static const void *kQjsSymbolKeepers[] = {
    (void *) (QjsVoidFn) qjs_create_runtime,
    (void *) (QjsVoidFn) qjs_destroy_runtime,
    (void *) (QjsVoidFn) qjs_set_max_stack_size,
    (void *) (QjsVoidFn) qjs_get_global_object,
    (void *) (QjsVoidFn) qjs_set_property,
    (void *) (QjsVoidFn) qjs_get_property,
    (void *) (QjsVoidFn) qjs_new_function,
    (void *) (QjsVoidFn) qjs_call_function,
    (void *) (QjsVoidFn) qjs_invoke_method,
    (void *) (QjsVoidFn) qjs_register_module,
    (void *) (QjsVoidFn) qjs_evaluate_unified,
    (void *) (QjsVoidFn) qjs_evaluate_file_unified,
    (void *) (QjsVoidFn) qjs_compile_to_bytecode_out,
    (void *) (QjsVoidFn) qjs_run_jobs,
    (void *) (QjsVoidFn) qjs_invoke_async,
    (void *) (QjsVoidFn) qjs_alloc_await_id,
    (void *) (QjsVoidFn) qjs_take_awaited,
    (void *) (QjsVoidFn) qjs_async_resolve_typed,
    (void *) (QjsVoidFn) qjs_async_reject,
    (void *) (QjsVoidFn) qjs_free_result_content,
    (void *) (QjsVoidFn) qjs_free_value,
    (void *) (QjsVoidFn) qjs_set_use_binary_protocol,
    (void *) (QjsVoidFn) qjs_set_debug_logging,
    (void *) (QjsVoidFn) qjs_set_event_callback,
    (void *) (QjsVoidFn) qjs_create_js_context,
    (void *) (QjsVoidFn) qjs_destroy_context,
    (void *) (QjsVoidFn) qjs_get_bytecode_version,
};

void dummy_keep_symbols(void) {
    // 防止编译器优化掉数组。
    for (size_t i = 0; i < sizeof(kQjsSymbolKeepers) / sizeof(kQjsSymbolKeepers[0]); i++) {
        volatile const void *p = kQjsSymbolKeepers[i];
        (void) p;
    }
}
