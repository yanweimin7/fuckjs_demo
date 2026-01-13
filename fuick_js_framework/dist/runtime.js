"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Runtime = void 0;
exports.bindGlobals = bindGlobals;
const PageRender = __importStar(require("./page_render"));
const Console = __importStar(require("./ex/console"));
const Timer = __importStar(require("./ex/timer"));
function bindGlobals() {
    setupPolyfills();
    // 显式挂载到 globalThis，确保 Flutter 侧可以访问到
    Object.assign(globalThis, {
        FuickUIController: {
            render: PageRender.render,
            destroy: PageRender.destroy,
            getItemDSL: PageRender.getItemDSL,
            dispatchEvent: (eventObj, payload) => {
                const r = PageRender.ensureRenderer();
                r.dispatchEvent(eventObj, payload);
            }
        }
    });
}
exports.Runtime = {
    bindGlobals
};
function setupPolyfills() {
    // Console
    const oldConsole = globalThis.console || {};
    globalThis.console = {
        ...oldConsole,
        log: Console.log,
        warn: Console.warn,
        error: Console.error
    };
    // Timer
    globalThis.setTimeout = Timer.setTimeout;
    globalThis.clearTimeout = Timer.clearTimeout;
    globalThis.setInterval = Timer.setInterval;
    globalThis.clearInterval = Timer.clearInterval;
    // Performance
    if (!globalThis.performance) {
        globalThis.performance = {
            now: () => Date.now()
        };
    }
    // queueMicrotask
    if (typeof globalThis.queueMicrotask !== 'function') {
        globalThis.queueMicrotask = function (fn) {
            Promise.resolve().then(fn);
        };
    }
    else {
        const originalQueueMicrotask = globalThis.queueMicrotask;
        globalThis.queueMicrotask = function (fn) {
            notifyMicrotaskEnqueued();
            originalQueueMicrotask(fn);
        };
    }
    setupPromiseInterception();
}
function notifyMicrotaskEnqueued() {
    // @ts-ignore
    if (typeof globalThis.__qjs_run_jobs === 'function') {
        // @ts-ignore
        globalThis.__qjs_run_jobs();
    }
}
function setupPromiseInterception() {
    const Proto = Promise.prototype;
    const originalThen = Proto.then;
    const originalCatch = Proto.catch;
    const originalFinally = Proto.finally;
    // @ts-ignore
    Proto.then = function (onfulfilled, onrejected) {
        notifyMicrotaskEnqueued();
        return originalThen.call(this, onfulfilled, onrejected);
    };
    // @ts-ignore
    Proto.catch = function (onrejected) {
        notifyMicrotaskEnqueued();
        return originalCatch.call(this, onrejected);
    };
    // @ts-ignore
    Proto.finally = function (onfinally) {
        notifyMicrotaskEnqueued();
        return originalFinally.call(this, onfinally);
    };
}
