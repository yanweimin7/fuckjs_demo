let nextTimerId = 1;
const timerMap = new Map<number, { fn: Function; type: 'timeout' | 'interval' }>();

export function setTimeout(fn: Function, ms?: number): number {
    const id = nextTimerId++;
    timerMap.set(id, { fn, type: 'timeout' });

    if (typeof dartCallNative === 'function') {
        dartCallNative('createTimer', { id, delay: ms || 0, isInterval: false });
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

__handleTimer = (id: number) => {
    const entry = timerMap.get(id);
    if (entry) {
        if (entry.type === 'timeout') {
            timerMap.delete(id);
        }

        Promise.resolve().then(() => {
            try {
                if (typeof entry.fn === 'function') {
                    entry.fn();
                } else {
                    console.error(`[Timer] Callback for timer ${id} is not a function:`, entry.fn);
                }
            } catch (e) {
                console.error(`[Timer] Error in timer ${id} callback:`, e);
            }
        });
    }
};
