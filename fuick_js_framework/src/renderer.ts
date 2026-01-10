import ReactReconciler from 'react-reconciler';
import { createHostConfig } from './hostConfig';
import { isBoundaryWidget, getWidgetMetadata } from './widgets';

interface EventHandler {
  fn: Function;
  pageId: number;
}

const eventHandlers: Record<string, EventHandler> = {};
const pageEvents: Record<number, Set<string>> = {};
const nodeEventMap: Map<number, Record<string, string>> = new Map();
let nextEventId = 1;

function isBoundaryNode(type: string): boolean {
  return isBoundaryWidget(type);
}

export function createEvent(fn: Function, pageId: number, nodeId: number, key: string): string {
  const nodeEvents = nodeEventMap.get(nodeId) || {};
  if (nodeEvents[key]) {
    const existingId = nodeEvents[key];
    if (eventHandlers[existingId]) {
      eventHandlers[existingId].fn = fn; // Update function reference
      return existingId;
    }
  }

  const id = String(nextEventId++);
  eventHandlers[id] = { fn, pageId };
  if (!pageEvents[pageId]) pageEvents[pageId] = new Set();
  pageEvents[pageId].add(id);

  nodeEvents[key] = id;
  nodeEventMap.set(nodeId, nodeEvents);
  return id;
}

export function dispatchEvent(id: string, payload: any) {
  try {
    const entry = eventHandlers[id];
    if (entry && typeof entry.fn === 'function') {
      entry.fn(payload);
    }
  } catch (e) {
    console.error(`[Renderer] Error in dispatchEvent:`, e);
  }
}

function mapInteractiveProps(type: string, props: any, pageId: number, nodeId: number) {
  const p: any = {};
  const metadata = getWidgetMetadata(type);
  const supportedEvents = new Set(metadata?.events || []);

  if (props) {
    for (const key in props) {
      if (key === 'children') continue;
      if (key === 'key' || key === 'ref') continue;

      const value = props[key];
      if (typeof value === 'function') {
        if (supportedEvents.has(key)) {
          const id = createEvent(value, pageId, nodeId, key);
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

  const props = mapInteractiveProps(type, node.props || {}, pageId, node.id) || {};
  const children = (node.children || [])
    .map((child: any) => toDsl(child, pageId))
    .filter((c: any) => c !== null && c !== undefined);

  return {
    id: node.id,
    type: String(type),
    isBoundary: isBoundaryNode(type),
    props: props,
    children: children
  };
}

export function createRenderer() {
  const renderedPages = new Set<number>();

  const reconciler = ReactReconciler(createHostConfig((pageId: number, rootJson: any, changedNodes: Set<any>) => {
    try {
      if (!rootJson) {
        console.warn(`[Renderer] Skip renderUI for page ${pageId}: rootJson is null`);
        return;
      }

      const isInitial = !renderedPages.has(pageId);
      console.log(`[Renderer] onCommit for page ${pageId}, isInitial: ${isInitial}, changedNodes: ${changedNodes.size}`);

      if (isInitial) {
        const dsl = toDsl(rootJson, pageId);
        if (dsl && dsl.type) {
          if (typeof dartCallNative === 'function') {
            console.log(`[Renderer] calling renderUI for page ${pageId}`);
            dartCallNative('renderUI', {
              pageId: Number(pageId),
              renderData: dsl
            });
            renderedPages.add(pageId);
          }
        }
      } else {
        // Partial update
        const patches = Array.from(changedNodes).map(node => {
          const type = node.type;
          const props = mapInteractiveProps(type, node.props || {}, pageId, node.id) || {};
          const childrenIds = (node.children || []).map((c: any) => c.id);
          return {
            id: node.id,
            type: String(type),
            isBoundary: isBoundaryNode(type),
            props: props,
            childrenIds: childrenIds
          };
        });

        if (patches.length > 0 && typeof dartCallNative === 'function') {
          console.log(`[Renderer] calling patchUI for page ${pageId}, patches: ${patches.length}`);
          dartCallNative('patchUI', {
            pageId: Number(pageId),
            patches: patches
          });
        }
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
            console.log(`[Renderer] Attempting to destroy page ${pageId}...`);
            reconciler.updateContainer(null, root, null, () => {
              console.log(`[Renderer] Page ${pageId} unmounted successfully`);
            });
            delete roots[pageId];
            delete containers[pageId];
            renderedPages.delete(pageId);
          } catch (e: any) {
            const msg = e.message || String(e);
            if (msg.includes('327') || msg.includes('working')) {
              console.warn(`[Renderer] Reentrancy collision during destroy for page ${pageId}, retrying...`);
              globalThis.setTimeout(performDestroy, 16);
            } else {
              console.error(`[Renderer] Error destroying page ${pageId}:`, e);
              delete roots[pageId];
              delete containers[pageId];
              renderedPages.delete(pageId);
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

      // Clear nodeEventMap for nodes belonging to this page
      // Note: This is a bit tricky as we don't track node-to-page mapping easily.
      // But since nodeIds are global, we can just leave it for now or implement a better cleanup.
      // A better way is to use a WeakMap if we had the actual node objects as keys.
    },
    createEvent,
    dispatchEvent,
  };
}
