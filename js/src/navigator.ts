export function push(path: string, params: any) {
    if (typeof dartCallNative === 'function') {
        dartCallNative('push', { path, params });
    }
}

export function pop() {
    if (typeof dartCallNative === 'function') {
        dartCallNative('pop', {});
    }
}
