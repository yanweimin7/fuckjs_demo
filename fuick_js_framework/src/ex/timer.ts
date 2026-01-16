let nextTimerId = 1;
const timerMap = new Map<number, { fn: Function; type: 'timeout' | 'interval' }>();

export function setTimeout(fn: Function, ms?: number): number {
    const id = nextTimerId++;
    timerMap.set(id, { fn, type: 'timeout' });

    const delay = ms || 0;


    if (typeof dartCallNative === 'function') {
        dartCallNative('createTimer', { id, delay, isInterval: false });
    } else {
        fn();
    }
    return id;
}

export function clearTimeout(id: number) {
    timerMap.delete(id);
    if (typeof dartCallNative === 'function') {
        dartCallNative('deleteTimer', { id });
    }
}

export function setInterval(fn: Function, ms?: number): number {
    const id = nextTimerId++;
    timerMap.set(id, { fn, type: 'interval' });
    if (typeof dartCallNative === 'function') {
        dartCallNative('createTimer', { id, delay: ms || 0, isInterval: true });
    }
    return id;
}

export function clearInterval(id: number) {
    timerMap.delete(id);
    if (typeof dartCallNative === 'function') {
        dartCallNative('deleteTimer', { id });
    }
}

(globalThis as any).__handleTimer = (id: number) => {
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
            } else {
                console.error(`[Timer] Callback for timer ${id} is not a function:`, entry.fn);
            }
        } catch (e) {
            console.error(`[Timer] Error in timer ${id} callback:`, e);
        }
    }
};
