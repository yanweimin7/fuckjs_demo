"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.push = push;
exports.pop = pop;
function push(path, params) {
    if (typeof dartCallNative === 'function') {
        dartCallNative('push', { path, params });
    }
}
function pop() {
    if (typeof dartCallNative === 'function') {
        dartCallNative('pop', {});
    }
}
