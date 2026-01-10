"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatchEvent = dispatchEvent;
exports.createRenderer = createRenderer;
const react_reconciler_1 = __importDefault(require("react-reconciler"));
const hostConfig_1 = require("./hostConfig");
function isBoundaryNode(node) {
    if (node.props && node.props.isBoundary !== undefined) {
        return !!node.props.isBoundary;
    }
    return false;
}
function dispatchEvent(eventObj, payload) {
    try {
        const nodeId = eventObj?.id;
        const eventKey = eventObj?.eventKey;
        const node = (0, hostConfig_1.getNodeById)(nodeId);
        if (node) {
            const fn = node.getCallback(eventKey);
            if (typeof fn === 'function') {
                fn(payload);
            }
        }
    }
    catch (e) {
        console.error(`[Renderer] Error in dispatchEvent:`, e);
    }
}
function mapInteractiveProps(type, props, pageId, node) {
    const p = {};
    if (props) {
        for (const key in props) {
            if (key === 'children')
                continue;
            if (key === 'key' || key === 'ref' || key === 'isBoundary')
                continue;
            const value = props[key];
            if (typeof value === 'function') {
                node.saveCallback(key, value);
                p[key] = { id: node.id, eventKey: key };
            }
            else if (key === 'style' && value && typeof value === 'object') {
                p[key] = { ...value };
            }
            else {
                // Check if value is or contains a React Element
                const hasJSX = (val) => {
                    if (!val || typeof val !== 'object')
                        return false;
                    if (val.$$typeof)
                        return true;
                    if (Array.isArray(val))
                        return val.some(hasJSX);
                    return false;
                };
                if (hasJSX(value)) {
                    const componentName = node.type;
                    throw new Error(`[FuickJS] JSX/React Elements are not allowed in props (detected in '${key}' prop of '${componentName}'). ` +
                        `Please use the 'FlutterProps' component or 'children' instead.`);
                }
                p[key] = value;
            }
        }
    }
    return p;
}
function toDsl(node, pageId) {
    if (!node || typeof node !== 'object')
        return null;
    let type = node.type;
    if (!type)
        return null; // 必须有 type 才是有效的 DSL 节点
    // Strip 'flutter-' prefix and convert kebab-case to PascalCase for Flutter side recognition
    if (type === 'flutter-props') {
        type = 'FlutterProps';
    }
    else if (type.startsWith('flutter-')) {
        type = type.substring(8)
            .split('-')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join('');
    }
    const props = mapInteractiveProps(type, node.props || {}, pageId, node) || {};
    // Inject node ID into props for stateful components like TextField to persist state
    props['__nodeId'] = node.id;
    const rawChildren = node.children || [];
    const children = [];
    for (const child of rawChildren) {
        if (child && child.type === 'flutter-props') {
            const propsKey = child.props?.propsKey;
            if (propsKey) {
                const propChildren = (child.children || [])
                    .map((c) => toDsl(c, pageId))
                    .filter((c) => c !== null);
                if (propChildren.length > 0) {
                    const newValue = propChildren.length === 1 ? propChildren[0] : propChildren;
                    if (props[propsKey]) {
                        // If already exists, convert to list or append to list
                        if (Array.isArray(props[propsKey])) {
                            props[propsKey].push(newValue);
                        }
                        else {
                            props[propsKey] = [props[propsKey], newValue];
                        }
                    }
                    else {
                        props[propsKey] = newValue;
                    }
                }
            }
        }
        else {
            const dslChild = toDsl(child, pageId);
            if (dslChild) {
                children.push(dslChild);
            }
        }
    }
    return {
        id: node.id,
        type: String(type),
        isBoundary: isBoundaryNode(node),
        props: props,
        children: children
    };
}
function createRenderer() {
    const renderedPages = new Set();
    const reconciler = (0, react_reconciler_1.default)((0, hostConfig_1.createHostConfig)((pageId, rootJson, changedNodes, deletedIds) => {
        try {
            if (!rootJson) {
                console.warn(`[Renderer] Skip renderUI for page ${pageId}: rootJson is null`);
                return;
            }
            const isInitial = !renderedPages.has(pageId);
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
            }
            else {
                // Partial update
                const patches = [];
                const processedNodes = new Set();
                // Handle deletions
                if (deletedIds && deletedIds.size > 0) {
                    for (const id of deletedIds) {
                        patches.push({ id, action: 'remove' });
                    }
                }
                // Sort nodes by ID or depth to ensure parent-child consistency if needed, 
                // but here we just need to handle flutter-props redirection.
                for (const node of changedNodes) {
                    if (processedNodes.has(node.id))
                        continue;
                    let targetNode = node;
                    // If this is a flutter-props node, we need to patch its parent 
                    // because flutter-props is merged into parent props.
                    if (targetNode.type === 'flutter-props') {
                        if (targetNode.parent) {
                            targetNode = targetNode.parent;
                        }
                        else {
                            continue; // Root cannot be flutter-props
                        }
                    }
                    if (processedNodes.has(targetNode.id))
                        continue;
                    // When mapping props for a node, we need the SAME logic as toDsl 
                    // to pull in any flutter-props children.
                    const dsl = toDsl(targetNode, pageId);
                    if (dsl) {
                        patches.push({
                            id: dsl.id,
                            type: dsl.type,
                            isBoundary: dsl.isBoundary,
                            props: dsl.props,
                            childrenIds: dsl.children.map((c) => c.id)
                        });
                        processedNodes.add(targetNode.id);
                    }
                }
                if (patches.length > 0 && typeof dartCallNative === 'function') {
                    console.log(`[Renderer] Sending ${patches.length} patches to Flutter for page ${pageId}`);
                    // console.log(`[Renderer] Patches: ${JSON.stringify(patches)}`);
                    dartCallNative('patchUI', {
                        pageId: Number(pageId),
                        patches: patches
                    });
                }
            }
        }
        catch (e) {
            console.error(`[Renderer] Error during render commit for page ${pageId}:`, e);
        }
    }));
    const containers = {};
    const roots = {};
    const deletedNodes = {};
    function ensureRoot(pageId) {
        if (roots[pageId])
            return roots[pageId];
        const container = { root: null, pageId };
        const root = reconciler.createContainer(container, 0, false, null);
        containers[pageId] = container;
        roots[pageId] = root;
        deletedNodes[pageId] = new Set();
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
                        renderedPages.delete(pageId);
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
                            renderedPages.delete(pageId);
                        }
                    }
                };
                performDestroy();
            }
        },
        dispatchEvent,
    };
}
