export function log(...args: any[]) {
    const message = args.map(a => String(a)).join(' ');
    if (typeof dartCallNative === 'function') {
        dartCallNative('console', { level: 'log', message });
    } else if (typeof (globalThis as any).print === 'function') {
        (globalThis as any).print(message);
    }
}

export function warn(...args: any[]) {
    const message = args.map(a => String(a)).join(' ');
    if (typeof dartCallNative === 'function') {
        dartCallNative('console', { level: 'warn', message });
    } else if (typeof (globalThis as any).print === 'function') {
        (globalThis as any).print('[WARN] ' + message);
    }
}

export function error(...args: any[]) {
    const message = args.map(a => String(a)).join(' ');
    if (typeof dartCallNative === 'function') {
        dartCallNative('console', { level: 'error', message });
    } else if (typeof (globalThis as any).print === 'function') {
        (globalThis as any).print('[ERROR] ' + message);
    }
}
