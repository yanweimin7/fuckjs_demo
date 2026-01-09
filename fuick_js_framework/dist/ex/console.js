"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = log;
exports.warn = warn;
exports.error = error;
function log(...args) {
    const message = args.map(a => String(a)).join(' ');
    if (typeof dartCallNative === 'function') {
        dartCallNative('console', { level: 'log', message });
    }
    else if (typeof globalThis.print === 'function') {
        globalThis.print(message);
    }
}
function warn(...args) {
    const message = args.map(a => String(a)).join(' ');
    if (typeof dartCallNative === 'function') {
        dartCallNative('console', { level: 'warn', message });
    }
    else if (typeof globalThis.print === 'function') {
        globalThis.print('[WARN] ' + message);
    }
}
function error(...args) {
    const message = args.map(a => String(a)).join(' ');
    if (typeof dartCallNative === 'function') {
        dartCallNative('console', { level: 'error', message });
    }
    else if (typeof globalThis.print === 'function') {
        globalThis.print('[ERROR] ' + message);
    }
}
