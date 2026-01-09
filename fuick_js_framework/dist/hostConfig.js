"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHostConfig = void 0;
const TEXT_TYPE = 'Text';
function makeNode(type, props) {
    const p = { ...(props || {}) };
    return { type, props: p, children: [] };
}
function applyProps(node, newProps) {
    node.props = { ...(newProps || {}) };
}
const createHostConfig = (onCommit) => {
    return {
        now: Date.now,
        supportsMutation: true,
        getPublicInstance: (inst) => inst,
        getRootHostContext: (root) => null,
        getChildHostContext: (parentHostContext, type, root) => null,
        shouldSetTextContent: (type, props) => false,
        createInstance: (type, props, root, hostContext, internalInstanceHandle) => {
            return makeNode(type, props);
        },
        createTextInstance: (text, root, hostContext, internalInstanceHandle) => {
            return makeNode(TEXT_TYPE, { text });
        },
        appendInitialChild: (parent, child) => {
            parent.children.push(child);
        },
        finalizeInitialChildren: (instance, type, props, rootContainer, hostContext) => false,
        appendChildToContainer: (container, child) => {
            container.root = child;
        },
        appendChild: (parent, child) => {
            parent.children.push(child);
        },
        insertBefore: (parentInstance, child, beforeChild) => {
            const i = parentInstance.children.indexOf(beforeChild);
            if (i >= 0) {
                parentInstance.children.splice(i, 0, child);
            }
            else {
                parentInstance.children.push(child);
            }
        },
        removeChild: (parentInstance, child) => {
            const i = parentInstance.children.indexOf(child);
            if (i >= 0)
                parentInstance.children.splice(i, 1);
        },
        removeChildFromContainer: (container, child) => {
            if (container.root === child) {
                container.root = null;
            }
        },
        insertInContainerBefore: (container, child, beforeChild) => {
            container.root = child;
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
        },
        commitTextUpdate: (textInstance, oldText, newText) => {
            textInstance.props.text = String(newText);
        },
        resetAfterCommit: (container) => {
            console.log(`[HostConfig] Commit finished for page ${container.pageId}`);
            if (typeof onCommit === 'function') {
                onCommit(container.pageId, container.root);
            }
        },
        prepareForCommit: (container) => {
        },
        supportsHydration: false,
    };
};
exports.createHostConfig = createHostConfig;
