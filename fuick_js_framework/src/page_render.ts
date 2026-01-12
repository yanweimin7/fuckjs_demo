import React from 'react';
import { createRenderer } from './renderer';
import * as Router from './router';

let renderer: any = null;

export function ensureRenderer() {
    if (renderer) return renderer;
    renderer = createRenderer();
    return renderer;
}

export function render(pageId: number, path: string, params: any) {
    const r = ensureRenderer();
    console.log('render', pageId, path, params);
    const factory = Router.match(path);
    if (typeof factory === 'function') {
        const app = factory(params || {});
        r.update(app, pageId);
    } else {
        const app = React.createElement('Column', { padding: 16, mainAxisAlignment: 'center' } as any,
            React.createElement('Text', { text: `Route ${path} not found`, fontSize: 16, color: '#cc0000' } as any),
        );
        r.update(app, pageId);
    }
}

export function destroy(pageId: number) {
    const r = ensureRenderer();
    r.destroy(pageId);
}

export function getItemDSL(pageId: number, refId: string, index: number) {
    const r = ensureRenderer();
    return r.getItemDSL(pageId, refId, index);
}
