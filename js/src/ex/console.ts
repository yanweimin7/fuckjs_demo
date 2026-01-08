export function log(...args: any[]) {
    if (typeof dartCallNative === 'function') {
        dartCallNative('console', { level: 'log', message: args.map(a => String(a)).join(' ') });
    }
}

export function warn(...args: any[]) {
    if (typeof dartCallNative === 'function') {
        dartCallNative('console', { level: 'warn', message: args.map(a => String(a)).join(' ') });
    }
}

export function error(...args: any[]) {
    if (typeof dartCallNative === 'function') {
        dartCallNative('console', { level: 'error', message: args.map(a => String(a)).join(' ') });
    }
}
