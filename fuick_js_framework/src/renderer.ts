import ReactReconciler from 'react-reconciler';
import { createHostConfig } from './hostConfig';
import { PageContainer } from './PageContainer';

const containers: Record<number, PageContainer> = {};
const roots: Record<number, any> = {};

export function dispatchEvent(eventObj: any, payload: any) {
  try {
    const pageId = eventObj?.pageId;
    const nodeId: number = Number(eventObj?.nodeId || eventObj?.id);
    const eventKey = eventObj?.eventKey;

    console.log(`[Renderer] dispatchEvent pageId=${pageId}, nodeId=${nodeId}, eventKey=${eventKey}`);

    const container = containers[pageId];
    if (container) {
      const fn = container.getCallback(nodeId, eventKey);
      if (typeof fn === 'function') {
        console.log(`[Renderer] Found callback for nodeId=${nodeId}, eventKey=${eventKey}, executing...`);
        fn(payload);
      } else {
        console.warn(`[Renderer] Callback not found for nodeId=${nodeId}, eventKey=${eventKey}`);
      }
    } else {
      console.warn(`[Renderer] Container not found for pageId=${pageId}`);
    }
  } catch (e) {
    console.error(`[Renderer] Error in dispatchEvent:`, e);
  }
}

export function createRenderer() {
  const reconciler = ReactReconciler(createHostConfig());

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
    getItemDSL(pageId: number, refId: string, index: number) {
      const container = containers[pageId];
      if (container) {
        return container.getItemDSL(refId, index);
      }
      return null;
    },
    elementToDsl(pageId: number, element: any) {
      const container = containers[pageId];
      if (container) {
        return (container as any).elementToDsl(element);
      }
      return null;
    }
  };
}
