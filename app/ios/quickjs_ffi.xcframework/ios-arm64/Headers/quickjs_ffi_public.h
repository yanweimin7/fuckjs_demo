#ifndef QUICKJS_FFI_PUBLIC_H
#define QUICKJS_FFI_PUBLIC_H

#include <stdint.h>

typedef struct QjsResult {
  int32_t type;
  int32_t error;
  int64_t i64;
  double f64;
  uint8_t b;
  char *s;
  uint8_t *data;
  int32_t data_len;
} QjsResult;

void *qjs_create_runtime(void);
void *qjs_create_context(void *runtime_handle);
void qjs_destroy_runtime(void *handle);
void qjs_destroy_context(void *handle);
char *qjs_evaluate_script(void *handle, const char *js_code);
void qjs_free_string(char *s);

void qjs_register_call_native(void *handle, void *cb);
void qjs_register_call_async_start(void *handle, void *cb);
void qjs_register_call_async_typed(void *handle, void *cb);

void qjs_async_resolve_typed(void *handle, int id, QjsResult *result);
void qjs_async_reject(void *handle, int id, const char *reason);

#endif
