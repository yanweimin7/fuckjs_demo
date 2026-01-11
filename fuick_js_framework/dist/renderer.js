"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatchEvent = dispatchEvent;
exports.createRenderer = createRenderer;
const react_reconciler_1 = __importDefault(require("react-reconciler"));
const hostConfig_1 = require("./hostConfig");
const PageContainer_1 = require("./PageContainer");
function dispatchEvent(eventObj, payload) {
    try {
        const nodeId = eventObj?.id;
        const eventKey = eventObj?.eventKey;
        const node = (0, hostConfig_1.getNodeById)(nodeId);
        if (node) {
            const fn = node.getCallback(eventKey);
            if (typeof fn === 'function') {
                // Wrap with act-like behavior if necessary or ensure React flushes updates
                fn(payload);
            }
        }
    }
    catch (e) {
        console.error(`[Renderer] Error in dispatchEvent:`, e);
    }
}
function createRenderer() {
    const reconciler = (0, react_reconciler_1.default)((0, hostConfig_1.createHostConfig)());
    const containers = {};
    const roots = {};
    function ensureRoot(pageId) {
        if (roots[pageId])
            return roots[pageId];
        const container = new PageContainer_1.PageContainer(pageId);
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
                        reconciler.updateContainer(null, root, null, () => {
                            console.log(`[Renderer] Page ${pageId} unmounted successfully`);
                        });
                        delete roots[pageId];
                        delete containers[pageId];
                    }
                    catch (e) {
                        const msg = e.message || String(e);
                        if (msg.includes('327') || msg.includes('working')) {
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
        },
        dispatchEvent,
    };
}
