"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEvent = createEvent;
exports.dispatchEvent = dispatchEvent;
exports.createRenderer = createRenderer;
const react_reconciler_1 = __importDefault(require("react-reconciler"));
const hostConfig_1 = require("./hostConfig");
const eventHandlers = {};
const pageEvents = {};
let nextEventId = 1;
function createEvent(fn, pageId) {
    const id = String(nextEventId++);
    eventHandlers[id] = { fn, pageId };
    if (!pageEvents[pageId])
        pageEvents[pageId] = new Set();
    pageEvents[pageId].add(id);
    return id;
}
function dispatchEvent(id, payload) {
    try {
        const entry = eventHandlers[id];
        if (entry && typeof entry.fn === 'function')
            entry.fn(payload);
    }
    catch (e) {
        console.error(`[Renderer] Error in dispatchEvent:`, e);
    }
}
function mapInteractiveProps(type, props, pageId) {
    const p = {};
    if (props) {
        for (const key in props) {
            if (key === 'children')
                continue;
            if (key === 'key' || key === 'ref')
                continue;
            const value = props[key];
            if (typeof value === 'function') {
                if (key === 'onTap' || key === 'onChanged' || key === 'onSubmitted') {
                    const id = createEvent(value, pageId);
                    p[key + 'EventId'] = id;
                }
            }
            else if (key === 'style' && value && typeof value === 'object') {
                p[key] = { ...value };
            }
            else {
                p[key] = value;
            }
        }
    }
    return p;
}
function toDsl(node, pageId) {
    if (!node || typeof node !== 'object')
        return null;
    const type = node.type;
    if (!type)
        return null; // 必须有 type 才是有效的 DSL 节点
    const props = mapInteractiveProps(type, node.props || {}, pageId) || {};
    const children = (node.children || [])
        .map((child) => toDsl(child, pageId))
        .filter((c) => c !== null && c !== undefined);
    return {
        type: String(type),
        props: props,
        children: children
    };
}
function createRenderer() {
    const reconciler = (0, react_reconciler_1.default)((0, hostConfig_1.createHostConfig)((pageId, rootJson) => {
        try {
            if (!rootJson) {
                console.warn(`[Renderer] Skip renderUI for page ${pageId}: rootJson is null`);
                return;
            }
            const dsl = toDsl(rootJson, pageId);
            if (dsl && dsl.type) {
                if (typeof globalThis.dartCallNative === 'function') {
                    globalThis.dartCallNative('renderUI', {
                        pageId: Number(pageId),
                        renderData: dsl
                    });
                }
            }
            else {
                console.warn(`[Renderer] Skip renderUI for page ${pageId}: dsl is invalid`, dsl);
            }
        }
        catch (e) {
            console.error(`[Renderer] Error during render commit for page ${pageId}:`, e);
        }
    }));
    const containers = {};
    const roots = {};
    function ensureRoot(pageId) {
        if (roots[pageId])
            return roots[pageId];
        const container = { root: null, pageId };
        const root = reconciler.createContainer(container, 0, false, null);
        containers[pageId] = container;
        roots[pageId] = root;
        return root;
    }
    return {
        update(element, pageId) {
            const root = ensureRoot(pageId);
            const performUpdate = () => {
                try {
                    reconciler.updateContainer(element, root, null, () => {
                        // Success
                    });
                }
                catch (e) {
                    const msg = e.message || String(e);
                    if (msg.includes('327') || msg.includes('working')) {
                        globalThis.setTimeout(performUpdate, 16);
                    }
                    else {
                        console.error(`[Renderer] Error updating page ${pageId}:`, e);
                    }
                }
            };
            performUpdate();
        },
        destroy(pageId) {
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
                    }
                    catch (e) {
                        const msg = e.message || String(e);
                        if (msg.includes('327') || msg.includes('working')) {
                            console.warn(`[Renderer] Reentrancy collision during destroy for page ${pageId}, retrying...`);
                            globalThis.setTimeout(performDestroy, 16);
                        }
                        else {
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
