"use strict";
/**
 * fuickjs Web Worker 入口 —— DSL 生产线程的宿主壳。
 *
 * 见 docs/flutter-web-support.md §6.3。职责只有四件事，且顺序不能变：
 *   1. 打上 `__FUICK_HOST__` 标记，让 utils/env.ts 把本线程识别为 `browser-worker`
 *      （Worker 没有 document，不打标记会被误判成 QuickJS 引擎，从而注入依赖
 *      同步桥的 console/timer polyfill —— 那在 Worker 里必废）。
 *   2. 装 `dartCallNative` / `dartCallNativeAsync`。**必须在 bundle 加载之前**：
 *      polyfill/native-async-timeout.ts 在模块初始化时就会读取并包装
 *      `globalThis.dartCallNativeAsync`，晚装就包不上。
 *   3. `importScripts(bundleUrl)` 加载业务 bundle。
 *   4. 在 `fuickjs.*` 与主线程之间转发消息。
 *
 * 本文件**不 import 任何模块**：tsc 会把无 import/export 的 TS 视为 script 而非
 * module，产物是可直接被 `importScripts` 加载的普通脚本，不带 CommonJS 包装。
 * 修改时请勿引入 import/export，否则产物会出现 `exports is not defined`。
 */
(function bootstrapFuickWorker() {
    const g = globalThis;
    // ── 1. 宿主标记 ───────────────────────────────────────────────────────────
    g.__FUICK_HOST__ = 'browser-worker';
    const post = (message) => g.postMessage(message);
    const describeError = (e) => ({
        error: e instanceof Error ? `${e.name}: ${e.message}` : String(e),
        stack: e instanceof Error && e.stack ? e.stack : '',
    });
    // ── 2. 双桥 ──────────────────────────────────────────────────────────────
    /**
     * 同步桥在 Worker 里不可能实现：Worker 只能通过 postMessage 异步与主线程通信，
     * 真正的同步 RPC 需要 SharedArrayBuffer + Atomics.wait，而那要求整页开启跨源
     * 隔离（COOP/COEP），代价过高。因此这里直接抛出可读错误——让误用当场暴露，
     * 而不是挂死或静默返回 undefined。
     *
     * 语义上等价于 Dart 主 isolate 的 `allowSyncToAsyncFallback: false` 严格策略。
     */
    g.dartCallNative = function dartCallNative(method) {
        throw new Error(`dartCallNative("${method}") is unavailable inside the fuickjs Web Worker: ` +
            'a worker cannot call the main thread synchronously. ' +
            `Use dartCallNativeAsync("${method}", args) instead.`);
    };
    let nativeSeq = 0;
    const pendingNative = new Map();
    g.dartCallNativeAsync = function dartCallNativeAsync(method, args) {
        return new Promise((resolve, reject) => {
            const id = ++nativeSeq;
            pendingNative.set(id, { resolve, reject });
            try {
                post({ t: 'native', id: id, method: method, args: args === undefined ? null : args });
            }
            catch (e) {
                // postMessage 抛错基本只有一种原因：args 含不可结构化克隆的值
                // （函数 / Symbol / DOM 对象）。就地 reject，别让调用方永久 pending。
                pendingNative.delete(id);
                reject(e);
            }
        });
    };
    // ── 3 & 4. 消息处理 ──────────────────────────────────────────────────────
    let bundleLoaded = false;
    const resolveTarget = (objectName) => {
        if (objectName === null || objectName === undefined || objectName === '')
            return g;
        const target = g[objectName];
        if (target === null || target === undefined) {
            throw new Error(`fuickjs worker: object "${objectName}" not found on globalThis`);
        }
        return target;
    };
    const handleInit = (data) => {
        if (bundleLoaded) {
            post({ t: 'ready' });
            return;
        }
        try {
            const url = data.bundleUrl;
            if (typeof url === 'string' && url.length > 0) {
                importScripts(url);
            }
            // bundle 顶层同步执行完毕即视为就绪（bindGlobals 已挂好 globalThis.fuickjs）。
            // 没传 url 也算就绪：允许宿主自建 Worker 并自行 importScripts 的接法。
            bundleLoaded = true;
            post({ t: 'ready' });
        }
        catch (e) {
            post(Object.assign({ t: 'initError' }, describeError(e)));
        }
    };
    const handleCall = (data) => {
        const id = data.id;
        try {
            const target = resolveTarget(data.obj);
            const method = target[data.method];
            if (typeof method !== 'function') {
                throw new Error(`fuickjs worker: "${data.obj ?? 'globalThis'}.${data.method}" is not a function`);
            }
            const args = Array.isArray(data.args) ? data.args : [];
            const value = method.apply(target, args);
            // fuickjs.* 目前只有 getItemDSL 有返回值且是同步的，但这里对 thenable 也做
            // 兼容：日后暴露异步入口时无需改协议。
            if (value && typeof value.then === 'function') {
                value.then((v) => post({ t: 'callReply', id: id, ok: true, value: v === undefined ? null : v }), (e) => post(Object.assign({ t: 'callReply', id: id, ok: false }, describeError(e))));
                return;
            }
            post({ t: 'callReply', id: id, ok: true, value: value === undefined ? null : value });
        }
        catch (e) {
            post(Object.assign({ t: 'callReply', id: id, ok: false }, describeError(e)));
        }
    };
    const handleNativeReply = (data) => {
        const pending = pendingNative.get(data.id);
        if (!pending)
            return;
        pendingNative.delete(data.id);
        if (data.ok) {
            pending.resolve(data.value);
            return;
        }
        const err = new Error(data.error || 'native call failed');
        if (data.stack)
            err.stack = data.stack;
        pending.reject(err);
    };
    g.onmessage = function onmessage(event) {
        const data = event && event.data;
        if (!data || typeof data.t !== 'string')
            return;
        switch (data.t) {
            case 'init':
                handleInit(data);
                break;
            case 'call':
                handleCall(data);
                break;
            case 'nativeReply':
                handleNativeReply(data);
                break;
            default:
                break;
        }
    };
})();
