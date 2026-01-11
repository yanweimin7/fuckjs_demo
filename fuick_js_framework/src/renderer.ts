import ReactReconciler from 'react-reconciler';
import { createHostConfig, Node, getNodeById } from './hostConfig';
import { PageContainer } from './PageContainer';

export function dispatchEvent(eventObj: any, payload: any) {
  try {
    const nodeId = eventObj?.id;
    const eventKey = eventObj?.eventKey;
    const node = getNodeById(nodeId);
    if (node) {
      const fn = node.getCallback(eventKey);
      if (typeof fn === 'function') {
        // Wrap with act-like behavior if necessary or ensure React flushes updates
        fn(payload);
      }
    }
  } catch (e) {
    console.error(`[Renderer] Error in dispatchEvent:`, e);
  }
}

export function createRenderer() {
  const reconciler = ReactReconciler(createHostConfig());

  const containers: Record<number, PageContainer> = {};
  const roots: Record<number, any> = {};

  function ensureRoot(pageId: number) {
    if (roots[pageId]) return roots[pageId];
    const container = new PageContainer(pageId);
    const root = (reconciler as any).createContainer(container, 0, false, null);
    containers[pageId] = container;
    roots[pageId] = root;
    return root;
  }

  return {
    update(element: any, pageId: number) {
      const root = ensureRoot(pageId);

      const performUpdate = () => {
        try {
          reconciler.updateContainer(element, root, null, () => {
            // Success
          });
        } catch (e: any) {
          const msg = e.message || String(e);
          if (msg.includes('327') || msg.includes('working')) {
            globalThis.setTimeout(performUpdate, 16);
          } else {
            console.error(`[Renderer] Error updating page ${pageId}:`, e);
          }
        }
      };

      performUpdate();
    },

    destroy(pageId: number) {
      const root = roots[pageId];
      if (root) {
        const performDestroy = () => {
          try {
            reconciler.updateContainer(null, root, null, () => {
              console.log(`[Renderer] Page ${pageId} unmounted successfully`);
            });
            delete roots[pageId];
            delete containers[pageId];
          } catch (e: any) {
            const msg = e.message || String(e);
            if (msg.includes('327') || msg.includes('working')) {
              globalThis.setTimeout(performDestroy, 16);
            } else {
              console.error(`[Renderer] Error destroying page ${pageId}:`, e);
              delete roots[pageId];
              delete containers[pageId];
            }
          }
        };
        performDestroy();
      }
    },

    dispatchEvent,
  };
}
