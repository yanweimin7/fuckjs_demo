"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHostConfig = void 0;
const TEXT_TYPE = 'Text';
let nextNodeId = 1;
function makeNode(type, props) {
    const p = { ...(props || {}) };
    return { id: nextNodeId++, type, props: p, children: [] };
}
function applyProps(node, newProps) {
    node.props = { ...(newProps || {}) };
}
const createHostConfig = (onCommit) => {
    const changedNodes = new Set();
    return {
        now: Date.now,
        supportsMutation: true,
        getPublicInstance: (inst) => inst,
        getRootHostContext: (root) => null,
        getChildHostContext: (parentHostContext, type, root) => null,
        shouldSetTextContent: (type, props) => false,
        createInstance: (type, props, root, hostContext, internalInstanceHandle) => {
            const node = makeNode(type, props);
            changedNodes.add(node);
            return node;
        },
        createTextInstance: (text, root, hostContext, internalInstanceHandle) => {
            const node = makeNode(TEXT_TYPE, { text });
            changedNodes.add(node);
            return node;
        },
        appendInitialChild: (parent, child) => {
            parent.children.push(child);
            changedNodes.add(parent);
        },
        finalizeInitialChildren: (instance, type, props, rootContainer, hostContext) => false,
        appendChildToContainer: (container, child) => {
            container.root = child;
            changedNodes.add(child);
        },
        appendChild: (parent, child) => {
            parent.children.push(child);
            changedNodes.add(parent);
        },
        insertBefore: (parentInstance, child, beforeChild) => {
            const i = parentInstance.children.indexOf(beforeChild);
            if (i >= 0) {
                parentInstance.children.splice(i, 0, child);
            }
            else {
                parentInstance.children.push(child);
            }
            changedNodes.add(parentInstance);
        },
        removeChild: (parentInstance, child) => {
            const i = parentInstance.children.indexOf(child);
            if (i >= 0)
                parentInstance.children.splice(i, 1);
            changedNodes.add(parentInstance);
        },
        removeChildFromContainer: (container, child) => {
            if (container.root === child) {
                container.root = null;
            }
            // Container root changed, but we don't have a node for container.
            // Usually container root change means a full render.
        },
        insertInContainerBefore: (container, child, beforeChild) => {
            container.root = child;
            changedNodes.add(child);
        },
        resetTextContent: (instance) => {
            // No-op for our DSL
        },
        detachDeletedInstance: (instance) => {
            // No-op
        },
        clearContainer: (container) => {
            container.root = null;
        },
        prepareUpdate: (instance, type, oldProps, newProps, root, hostContext) => {
            return true;
        },
        commitUpdate: (instance, updatePayload, type, oldProps, newProps, internalInstanceHandle) => {
            applyProps(instance, newProps);
            changedNodes.add(instance);
        },
        commitTextUpdate: (textInstance, oldText, newText) => {
            textInstance.props.text = String(newText);
            changedNodes.add(textInstance);
        },
        resetAfterCommit: (container) => {
            console.log(`[HostConfig] Commit finished for page ${container.pageId}, changed nodes: ${changedNodes.size}`);
            if (typeof onCommit === 'function') {
                onCommit(container.pageId, container.root, new Set(changedNodes));
            }
            changedNodes.clear();
        },
        prepareForCommit: (container) => {
        },
        supportsHydration: false,
    };
};
exports.createHostConfig = createHostConfig;
