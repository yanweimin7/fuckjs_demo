import ReactReconciler from 'react-reconciler';
import { createHostConfig } from './hostConfig';

interface EventHandler {
  fn: Function;
  pageId: number;
}

const eventHandlers: Record<string, EventHandler> = {};
const pageEvents: Record<number, Set<string>> = {};
let nextEventId = 1;

export function createEvent(fn: Function, pageId: number): string {
  const id = String(nextEventId++);
  eventHandlers[id] = { fn, pageId };
  if (!pageEvents[pageId]) pageEvents[pageId] = new Set();
  pageEvents[pageId].add(id);
  return id;
}

export function dispatchEvent(id: string, payload: any) {
  try {
    const entry = eventHandlers[id];
    if (entry && typeof entry.fn === 'function') entry.fn(payload);
  } catch (e) {
    console.error(`[Renderer] Error in dispatchEvent:`, e);
  }
}

function mapInteractiveProps(type: string, props: any, pageId: number) {
  const p: any = {};
  if (props) {
    for (const key in props) {
      if (key === 'children') continue;
      if (key === 'key' || key === 'ref') continue;

      const value = props[key];
      if (typeof value === 'function') {
        if (key === 'onTap' || key === 'onChanged' || key === 'onSubmitted') {
          const id = createEvent(value, pageId);
          p[key + 'EventId'] = id;
        }
      } else if (key === 'style' && value && typeof value === 'object') {
        p[key] = { ...value };
      } else {
        p[key] = value;
      }
    }
  }
  return p;
}

function toDsl(node: any, pageId: number): any {
  if (!node || typeof node !== 'object') return null;
  const type = node.type;
  if (!type) return null; // 必须有 type 才是有效的 DSL 节点

  const props = mapInteractiveProps(type, node.props || {}, pageId) || {};
  const children = (node.children || [])
    .map((child: any) => toDsl(child, pageId))
    .filter((c: any) => c !== null && c !== undefined);

  return {
    type: String(type),
    props: props,
    children: children
  };
}

export function createRenderer() {
  const reconciler = ReactReconciler(createHostConfig((pageId: number, rootJson: any) => {
    try {
      if (!rootJson) {
        console.warn(`[Renderer] Skip renderUI for page ${pageId}: rootJson is null`);
        return;
      }
      const dsl = toDsl(rootJson, pageId);
      if (dsl && dsl.type) {
        if (typeof (globalThis as any).dartCallNative === 'function') {
          (globalThis as any).dartCallNative('renderUI', {
            pageId: Number(pageId),
            renderData: dsl
          });
        }
      } else {
        console.warn(`[Renderer] Skip renderUI for page ${pageId}: dsl is invalid`, dsl);
      }
    } catch (e) {
      console.error(`[Renderer] Error during render commit for page ${pageId}:`, e);
    }
  }));

  const containers: Record<number, any> = {};
  const roots: Record<number, any> = {};

  function ensureRoot(pageId: number) {
    if (roots[pageId]) return roots[pageId];
    const container = { root: null, pageId };
    const root = reconciler.createContainer(container, 0, false, null);
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
            console.log(`[Renderer] Attempting to destroy page ${pageId}...`);
            reconciler.updateContainer(null, root, null, () => {
              console.log(`[Renderer] Page ${pageId} unmounted successfully`);
            });
            delete roots[pageId];
            delete containers[pageId];
          } catch (e: any) {
            const msg = e.message || String(e);
            if (msg.includes('327') || msg.includes('working')) {
              console.warn(`[Renderer] Reentrancy collision during destroy for page ${pageId}, retrying...`);
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

      if (pageEvents[pageId]) {
        for (const id of pageEvents[pageId]) {
          delete eventHandlers[id];
        }
        delete pageEvents[pageId];
      }
    },
    createEvent,
    dispatchEvent,
  };
}
