import * as Router from './router';
import * as Navigator from './navigator';
import * as PageRender from './page_render';
import * as Console from './ex/console';
import * as Timer from './ex/timer';

export function bindGlobals() {
  setupPolyfills();
  (globalThis as any).ReactRenderer = {
    render: PageRender.render,
    destroy: PageRender.destroy
  };
  (globalThis as any).ReactRouter = Router.Router;
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

  if (typeof globalThis.queueMicrotask !== 'function') {
    globalThis.queueMicrotask = function (fn: () => void) {
      Promise.resolve().then(fn);
    };
  }
}
