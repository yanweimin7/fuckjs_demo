import React, { useContext, useEffect } from 'react';
import { PageContext } from './PageContext';
import * as PageRender from './page_render';

export function useVisible(callback: () => void) {
    const { pageId } = useContext(PageContext);

    useEffect(() => {
        const container = PageRender.getContainer(pageId);
        if (container) {
            container.registerVisibleCallback(callback);
        }
        return () => {
            const container = PageRender.getContainer(pageId);
            if (container) {
                container.unregisterVisibleCallback(callback);
            }
        };
    }, [pageId, callback]);
}

export function useInvisible(callback: () => void) {
    const { pageId } = useContext(PageContext);

    useEffect(() => {
        const container = PageRender.getContainer(pageId);
        if (container) {
            container.registerInvisibleCallback(callback);
        }
        return () => {
            const container = PageRender.getContainer(pageId);
            if (container) {
                container.unregisterInvisibleCallback(callback);
            }
        };
    }, [pageId, callback]);
}
