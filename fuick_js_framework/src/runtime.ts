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
      notifyLifecycle: PageRender.notifyLifecycle,
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
  // Helper for async invocation to break call stack from Dart
  (globalThis as any).__invokeAsync = (obj: any, method: string, ...args: any[]) => {
    return Promise.resolve().then(() => {
      const target = obj || globalThis;
      // @ts-ignore
      if (typeof target[method] === 'function') {
        // @ts-ignore
        return target[method](...args);
      }
    });
  };
}

