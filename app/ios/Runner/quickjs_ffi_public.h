#ifndef QUICKJS_FFI_PUBLIC_H
#define QUICKJS_FFI_PUBLIC_H

#include <stddef.h>
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

// Dart 回调签名：ctx_handle, method_name, args, argc, out_result, this_id
// this_id: Dart 端为该 JSObject 分配的自增唯一 id，蹦床从 func_data[2]
//         读出后透传给 Dart，Dart 端用此 id 查 objectCache。
typedef void (*DartNativeFunction)(void *handle, const char *method,
                                   QjsResult *args, int32_t argc,
                                   QjsResult *out, int64_t this_id);

// C 主动通知 Dart 的事件类型。p1 / p2 含义随 type 变化:
//   QJS_EVENT_AWAIT_READY : p1 = void *ctx_wrapper,
//                           p2 = (void *)(intptr_t)await_id
//   QJS_EVENT_ENQUEUE_JOB : p1 = void *ctx_wrapper, p2 = NULL
//                           同一 runtime 下所有 context 都会触发,
//                           Dart 端用 context_handle.address 找到对应
//                           QuickJsContext 实例。
typedef enum {
    QJS_EVENT_AWAIT_READY = 1,
    QJS_EVENT_ENQUEUE_JOB = 2,
} QjsEventType;

// 通用事件回调:Dart 侧只注册一个函数,C 侧按 type 派发不同事件。
typedef void (*QjsEventCallback)(int32_t type, void *p1, void *p2);

// 注册 Dart 侧的"事件"通知函数(由 NativeCallable.listener 提供)。
// handle 必须是 runtime handle(C 内部用 JS_GetRuntimeOpaque 索引到 wrapper)。
// fn 传 NULL 表示取消注册。
// C 侧每次 emit 事件都会主动回调该函数,Dart 不再需要 while 轮询。
void qjs_set_event_callback(void *handle, void *fn);

void *qjs_create_runtime(void);
void qjs_destroy_runtime(void *handle);
void qjs_set_max_stack_size(void *handle, size_t stack_size);

void qjs_get_global_object(void *handle, QjsResult *out);
void qjs_set_property(void *handle, QjsResult *obj_res, const char *prop,
                      QjsResult *val_res);
void qjs_get_property(void *handle, QjsResult *obj_res, const char *prop,
                      QjsResult *out);
void qjs_new_function(void *handle, const char *name, DartNativeFunction cb,
                      QjsResult *obj_res, int64_t id, QjsResult *out);
void qjs_call_function(void *handle, QjsResult *obj_res, QjsResult *args,
                       int32_t argc, QjsResult *out);
void qjs_invoke_method(void *handle, QjsResult *obj_res, const char *name,
                       QjsResult *args, int32_t argc, QjsResult *out);
void qjs_register_module(void *handle, const char *name, const char *code,
                         int32_t len);
// 统一的 eval 入口,flags 位定义:
//   0x1 QJS_EVAL_FLAG_MODULE   - 1: ES module / 0: 全局脚本
//   0x2 QJS_EVAL_FLAG_BYTECODE - 1: 输入字节码 / 0: 源码
// return_value: 0 表示丢弃返回值(避免大 bundle 序列化),1 按实际类型返回。
void qjs_evaluate_unified(void *handle, const char *code, int32_t len,
                          int32_t flags, int32_t return_value, QjsResult *out);
void qjs_compile_to_bytecode_out(void *handle, const char *code, int32_t len,
                                 int32_t is_module, int32_t strip,
                                 QjsResult *out);
int32_t qjs_run_jobs(void *handle);

void *qjs_create_js_context(void *rt_handle);
void qjs_destroy_context(void *handle);
void qjs_evaluate_file_unified(void *handle, const char *path,
                               int32_t flags, int32_t return_value,
                               QjsResult *out);
int qjs_get_bytecode_version(void);
void qjs_free_value(void *ctx_handle, QjsResult *res);
void qjs_set_debug_logging(int enabled);

void qjs_async_resolve_typed(void *handle, int id, QjsResult *result);
void qjs_async_reject(void *handle, int id, const char *reason);

// 异步调用 JS 方法,把所有形式（同步函数 / async 函数 / 返回 Promise 的函数）
// 统一暴露为一次性 poll 模型。
//
// qjs_invoke_async:
//   - 同步分支:函数同步返回值会被立刻写入 out (type=QJS_TYPE_INT64, i64=id)，
//     等待表里 id 对应条目 settled=RESOLVED,Dart 侧下次 poll 即可取走。
//   - 异步分支:函数返回 Promise,引擎为该 Promise 挂上 .then/.catch,
//     promise settle 时把结果/原因回填到等待表。
//   - 同步抛错或目标不是函数:out->error=1,out->s=错误消息,Dart 立即失败,
//     不会分配 id。
//
// Dart 用法:
//   int id = qjs_alloc_await_id(handle);
//   awaitCompleters[id] = completer;     // 提前注册,C 同步路径 push 事件能找到
//   qjs_invoke_async(handle, id, ...);
//
// object_name 为 NULL 时按全局函数查找,否则按 object_name.methodName。
// id 由 Dart 预分配并传入,避免 C 同步路径里 push 事件时 Dart 尚未拿到 id 的竞态。
// 同步抛错或目标不是函数时,out->error=1,out->s=错误消息,Dart 立即失败,不会
// 发送 AWAIT_READY 事件(completer 会一直悬挂,调用方需自行处理)。
void qjs_invoke_async(void *handle, int32_t id, const char *object_name,
                      const char *method_name, QjsResult *args, int32_t argc,
                      QjsResult *out);

// 分配一个新的 await id(单调递增,wrap 到 1)。Dart 端在 qjs_invoke_async 之前
// 调用一次拿 id,这样 Dart 可以先在 awaitCompleters 表里登记,再触发 C 调用,
// 避免 C 同步路径里 push AWAIT_READY 事件时 Dart 还没拿到 id 的竞态。
int32_t qjs_alloc_await_id(void *handle);

// 拉取 id 对应 await 结果。
// 返回值:0 已 resolve(out 填充为 resolved value, error=0)
//        1 仍 pending(out 未修改)
//        2 已 reject(out 填充为 rejection reason, error=1)
//       -1 id 不存在(out->error=1, out->s=描述)
int32_t qjs_take_awaited(void *handle, int32_t id, QjsResult *out);

void qjs_free_result_content(QjsResult *res);
void qjs_set_use_binary_protocol(int use);

#endif
