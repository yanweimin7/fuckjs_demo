#include "quickjs_ffi_public.h"

// This dummy function ensures that the symbols from quickjs_ffi.xcframework
// are linked into the final executable, so that Dart FFI can find them
// via DynamicLibrary.executable().
void dummy_keep_symbols() {
    qjs_create_runtime();
}
