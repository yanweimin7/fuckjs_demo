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

typedef void (*DartNativeFunction)(void *handle, const char *method,
                                   QjsResult *args, int32_t argc,
                                   QjsResult *out);

void *qjs_create_runtime(void);
void qjs_destroy_runtime(void *handle);

void qjs_get_global_object(void *handle, QjsResult *out);
void qjs_set_property(void *handle, QjsResult *obj_res, const char *prop,
                      QjsResult *val_res);
void qjs_get_property(void *handle, QjsResult *obj_res, const char *prop,
                      QjsResult *out);
void qjs_new_function(void *handle, const char *name, DartNativeFunction cb,
                      QjsResult *out);
void qjs_call_function(void *handle, QjsResult *obj_res, QjsResult *args,
                       int32_t argc, QjsResult *out);
void qjs_invoke_method(void *handle, QjsResult *obj_res, const char *name,
                       QjsResult *args, int32_t argc, QjsResult *out);
void qjs_evaluate_value_out(void *handle, const char *code, int32_t len,
                            int32_t is_bytecode, QjsResult *out);
int32_t qjs_run_jobs(void *handle);

void qjs_async_resolve_typed(void *handle, int id, QjsResult *result);
void qjs_async_reject(void *handle, int id, const char *reason);

void qjs_free_result_content(QjsResult *res);
void qjs_set_use_binary_protocol(int use);

#endif
