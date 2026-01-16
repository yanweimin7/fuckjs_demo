"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTimeout = setTimeout;
exports.clearTimeout = clearTimeout;
exports.setInterval = setInterval;
exports.clearInterval = clearInterval;
let nextTimerId = 1;
const timerMap = new Map();
function setTimeout(fn, ms) {
    const id = nextTimerId++;
    timerMap.set(id, { fn, type: 'timeout' });
    const delay = ms || 0;
    if (typeof dartCallNative === 'function') {
        dartCallNative('createTimer', { id, delay, isInterval: false });
    }
    else {
        fn();
    }
    return id;
}
function clearTimeout(id) {
    timerMap.delete(id);
    if (typeof dartCallNative === 'function') {
        dartCallNative('deleteTimer', { id });
    }
}
function setInterval(fn, ms) {
    const id = nextTimerId++;
    timerMap.set(id, { fn, type: 'interval' });
    if (typeof dartCallNative === 'function') {
        dartCallNative('createTimer', { id, delay: ms || 0, isInterval: true });
    }
    return id;
}
function clearInterval(id) {
    timerMap.delete(id);
    if (typeof dartCallNative === 'function') {
        dartCallNative('deleteTimer', { id });
    }
}
globalThis.__handleTimer = (id) => {
    // console.log('wine __handleTimer', id);
    const entry = timerMap.get(id);
    if (entry) {
        if (entry.type === 'timeout') {
            timerMap.delete(id);
        }
        try {
            if (typeof entry.fn === 'function') {
                console.log('[Timer] executing callback for', id);
                entry.fn();
            }
            else {
                console.error(`[Timer] Callback for timer ${id} is not a function:`, entry.fn);
            }
        }
        catch (e) {
            console.error(`[Timer] Error in timer ${id} callback:`, e);
        }
    }
};
