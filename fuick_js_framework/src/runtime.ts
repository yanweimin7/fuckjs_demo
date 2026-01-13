import * as Router from './router';
import * as Navigator from './navigator';
import * as PageRender from './page_render';
import * as Console from './ex/console';
import * as Timer from './ex/timer';

export function bindGlobals() {
  setupPolyfills();

  // 显式挂载到 globalThis，确保 Flutter 侧可以访问到
  Object.assign(globalThis, {
    FuickUIController: {
      render: PageRender.render,
      destroy: PageRender.destroy,
      getItemDSL: PageRender.getItemDSL,
      dispatchEvent: (eventObj: any, payload: any) => {
        const r = PageRender.ensureRenderer();
        r.dispatchEvent(eventObj, payload);
      }
    }
  });
}

export const Runtime = {
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
  } as any;

  // Timer
  globalThis.setTimeout = Timer.setTimeout as any;
  globalThis.clearTimeout = Timer.clearTimeout as any;
  globalThis.setInterval = Timer.setInterval as any;
  globalThis.clearInterval = Timer.clearInterval as any;

  // Performance
  if (!globalThis.performance) {
    (globalThis as any).performance = {
      now: () => Date.now()
    };
  }
  // queueMicrotask
  if (typeof globalThis.queueMicrotask !== 'function') {
    globalThis.queueMicrotask = function (fn: () => void) {
      Promise.resolve().then(fn);
    };
  } else {
    const originalQueueMicrotask = globalThis.queueMicrotask;
    globalThis.queueMicrotask = function (fn: () => void) {
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
  Proto.then = function (onfulfilled?: any, onrejected?: any) {
    notifyMicrotaskEnqueued();
    return originalThen.call(this, onfulfilled, onrejected);
  };

  // @ts-ignore
  Proto.catch = function (onrejected?: any) {
    notifyMicrotaskEnqueued();
    return originalCatch.call(this, onrejected);
  };

  // @ts-ignore
  Proto.finally = function (onfinally?: any) {
    notifyMicrotaskEnqueued();
    return originalFinally.call(this, onfinally);
  };
}
