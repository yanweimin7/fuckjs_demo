import React from 'react';
import { createRenderer } from './renderer';
import * as Router from './router';
import { PageContext } from './PageContext';

let renderer: any = null;

export function ensureRenderer() {
    if (renderer) return renderer;
    renderer = createRenderer();
    return renderer;
}

export function render(pageId: number, path: string, params: any) {
    const startTime = Date.now();
    const r = ensureRenderer();
    console.log(`[JS Performance] render start for ${path}, pageId: ${pageId}`);
    const factory = Router.match(path);

    let app: any;
    if (typeof factory === 'function') {
        app = factory(params || {});
    } else {
        app = React.createElement('Column', { padding: 16, mainAxisAlignment: 'center' } as any,
            React.createElement('Text', { text: `Route ${path} not found`, fontSize: 16, color: '#cc0000' } as any),
        );
    }

    // Wrap with PageContext
    const wrappedApp = React.createElement(PageContext.Provider, { value: { pageId } }, app);
    r.update(wrappedApp, pageId);

    console.log(`[JS Performance] render total cost for ${path}: ${Date.now() - startTime}ms`);
}

export function destroy(pageId: number) {
    const r = ensureRenderer();
    r.destroy(pageId);
}

export function getItemDSL(pageId: number, refId: string, index: number) {
    const r = ensureRenderer();
    return r.getItemDSL(pageId, refId, index);
}

export function elementToDsl(pageId: number, element: any) {
    const r = ensureRenderer();
    return r.elementToDsl(pageId, element);
}
