"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHostConfig = exports.Node = void 0;
exports.getNodeById = getNodeById;
const TEXT_TYPE = 'Text';
let nextNodeId = 1;
const allNodes = new Map();
function getNodeById(id) {
    return allNodes.get(id);
}
class Node {
    constructor(type, props) {
        this.children = [];
        this.eventCallbacks = new Map();
        this.id = nextNodeId++;
        this.type = type;
        this.props = { ...(props || {}) };
        allNodes.set(this.id, this);
    }
    applyProps(newProps) {
        this.props = { ...(newProps || {}) };
    }
    saveCallback(key, fn) {
        this.eventCallbacks.set(key, fn);
    }
    getCallback(key) {
        return this.eventCallbacks.get(key);
    }
    destroy() {
        allNodes.delete(this.id);
        this.eventCallbacks.clear();
        for (const child of this.children) {
            child.destroy();
        }
    }
}
exports.Node = Node;
function makeNode(type, props) {
    return new Node(type, props);
}
function applyProps(node, newProps) {
    node.props = { ...(newProps || {}) };
}
function shallowEqual(a, b) {
    if (a === b)
        return true;
    if (!a || !b || typeof a !== 'object' || typeof b !== 'object')
        return false;
    const keysA = Object.keys(a).filter(k => k !== 'children');
    const keysB = Object.keys(b).filter(k => k !== 'children');
    if (keysA.length !== keysB.length)
        return false;
    for (const key of keysA) {
        if (Object.prototype.hasOwnProperty.call(b, key)) {
            if (a[key] !== b[key]) {
                // Only recurse for plain objects that might be style/decoration
                if (a[key] && b[key] &&
                    typeof a[key] === 'object' && typeof b[key] === 'object' &&
                    !Array.isArray(a[key]) && !Array.isArray(b[key]) &&
                    a[key].constructor === Object && b[key].constructor === Object) {
                    if (!shallowEqual(a[key], b[key]))
                        return false;
                }
                else {
                    return false;
                }
            }
        }
        else {
            return false;
        }
    }
    return true;
}
const createHostConfig = (onCommit) => {
    const changedNodes = new Set();
    const deletedIds = new Set();
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
            child.parent = parent;
            parent.children.push(child);
            changedNodes.add(parent);
        },
        finalizeInitialChildren: (instance, type, props, rootContainer, hostContext) => false,
        appendChildToContainer: (container, child) => {
            container.root = child;
            changedNodes.add(child);
        },
        appendChild: (parent, child) => {
            child.parent = parent;
            parent.children.push(child);
            changedNodes.add(parent);
        },
        insertBefore: (parentInstance, child, beforeChild) => {
            child.parent = parentInstance;
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
            deletedIds.add(child.id);
            child.destroy();
            changedNodes.add(parentInstance);
        },
        removeChildFromContainer: (container, child) => {
            if (container.root === child) {
                container.root = null;
            }
            deletedIds.add(child.id);
            child.destroy();
        },
        insertInContainerBefore: (container, child, beforeChild) => {
            container.root = child;
            changedNodes.add(child);
        },
        resetTextContent: (instance) => {
        },
        detachDeletedInstance: (instance) => {
            deletedIds.add(instance.id);
            instance.destroy();
        },
        clearContainer: (container) => {
            if (container.root) {
                deletedIds.add(container.root.id);
            }
            container.root = null;
        },
        prepareUpdate: (instance, type, oldProps, newProps, root, hostContext) => {
            if (shallowEqual(oldProps, newProps))
                return null;
            return true;
        },
        updateFiberProps: (instance, type, newProps) => {
            instance.applyProps(newProps);
            changedNodes.add(instance);
        },
        commitUpdate: (instance, updatePayload, type, oldProps, newProps, internalInstanceHandle) => {
            instance.applyProps(newProps);
            changedNodes.add(instance);
        },
        commitTextUpdate: (textInstance, oldText, newText) => {
            textInstance.props.text = String(newText);
            changedNodes.add(textInstance);
        },
        resetAfterCommit: (container) => {
            console.log(`[HostConfig] Commit finished for page ${container.pageId}, changed nodes: ${changedNodes.size}, deleted nodes: ${deletedIds.size}`);
            if (typeof onCommit === 'function') {
                onCommit(container.pageId, container.root, new Set(changedNodes), new Set(deletedIds));
            }
            changedNodes.clear();
            deletedIds.clear();
        },
        prepareForCommit: (container) => {
        },
        supportsHydration: false,
    };
};
exports.createHostConfig = createHostConfig;
