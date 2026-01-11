"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHostConfig = exports.Node = exports.TEXT_TYPE = void 0;
exports.getNodeById = getNodeById;
const react_1 = __importDefault(require("react"));
exports.TEXT_TYPE = 'Text';
let nextNodeId = 1;
const allNodes = new Map();
function getNodeById(id) {
    return allNodes.get(id);
}
class Node {
    constructor(type, props, container) {
        this.children = [];
        this.eventCallbacks = new Map();
        this.id = nextNodeId++;
        this.type = type;
        this.props = {}; // Initialize empty props
        this.container = container;
        allNodes.set(this.id, this);
        this.applyProps(props);
    }
    applyProps(newProps) {
        if (newProps) {
            // Use Object.assign to ensure all properties from newProps are copied, 
            // but filter out children as they are handled by reconciler.
            this.clearCallbacks();
            const propKeys = Object.keys(newProps);
            for (const key of propKeys) {
                if (key === 'children')
                    continue;
                const value = newProps[key];
                this.props[key] = value;
                if (typeof value === 'function') {
                    this.saveCallback(key, value);
                }
            }
        }
    }
    saveCallback(key, fn) {
        this.eventCallbacks.set(key, fn);
    }
    clearCallbacks() {
        this.eventCallbacks.clear();
    }
    getCallback(key) {
        return this.eventCallbacks.get(key);
    }
    toDsl() {
        let type = this.type;
        if (!type)
            return null;
        // Strip 'flutter-' prefix and convert kebab-case to PascalCase for Flutter side recognition
        if (type.startsWith('flutter-')) {
            type = type.substring(8)
                .split('-')
                .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                .join('');
        }
        const props = {};
        if (this.props) {
            // Use for...in for maximum compatibility with all object types
            for (const key in this.props) {
                if (key === 'children')
                    continue;
                if (key === 'key' || key === 'ref' || key === 'isBoundary')
                    continue;
                const value = this.props[key];
                if (typeof value === 'function') {
                    this.saveCallback(key, value);
                    props[key] = { id: this.id, eventKey: key };
                }
                else if (key === 'style' && value && typeof value === 'object') {
                    props[key] = { ...value };
                }
                else {
                    props[key] = value;
                }
            }
        }
        // Inject node ID into props for stateful components like TextField to persist state
        props['__nodeId'] = this.id;
        const children = [];
        for (const child of this.children) {
            if (child.type === 'flutter-props') {
                const propsKey = child.props?.propsKey;
                if (propsKey) {
                    const propChildren = child.children
                        .map((c) => c.toDsl())
                        .filter((c) => c !== null);
                    if (propChildren.length > 0) {
                        const newValue = propChildren.length === 1 ? propChildren[0] : propChildren;
                        if (props[propsKey]) {
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
                const dslChild = child.toDsl();
                if (dslChild) {
                    children.push(dslChild);
                }
            }
        }
        return {
            id: this.id,
            type: String(type),
            isBoundary: !!this.props?.isBoundary,
            props: props,
            children: children
        };
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
function deepEqual(objA, objB) {
    if (objA === objB)
        return true;
    if (!objA || !objB || typeof objA !== 'object' || typeof objB !== 'object')
        return false;
    // Handle React elements - we already handle them in diffProps, 
    // but if they end up here, we should treat them as not equal if references differ.
    if (react_1.default.isValidElement(objA) || react_1.default.isValidElement(objB))
        return objA === objB;
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    if (keysA.length !== keysB.length)
        return false;
    for (const key of keysA) {
        if (!Object.prototype.hasOwnProperty.call(objB, key))
            return false;
        const valA = objA[key];
        const valB = objB[key];
        // Recursively check for deep equality
        if (valA && valB && typeof valA === 'object' && typeof valB === 'object') {
            if (!deepEqual(valA, valB))
                return false;
        }
        else if (valA !== valB) {
            return false;
        }
    }
    return true;
}
function diffProps(oldProps, newProps) {
    const updatePayload = [];
    let hasChanges = false;
    // Check for deleted or changed props
    for (const key in oldProps) {
        if (key === 'children')
            continue;
        if (!(key in newProps)) {
            updatePayload.push(key, null);
            hasChanges = true;
        }
        else if (oldProps[key] !== newProps[key]) {
            // Special check for functions/objects
            const oldVal = oldProps[key];
            const newVal = newProps[key];
            if (typeof oldVal === 'function' && typeof newVal === 'function') {
                // Even if the function reference changed, we might not need a Flutter patch
                // if the representation is the same. But we need to update JS side callbacks.
                updatePayload.push(key, newVal);
                hasChanges = true;
            }
            else if (react_1.default.isValidElement(oldVal) || react_1.default.isValidElement(newVal)) {
                // If it's a JSX element (React element), we should treat it as changed
                // as its internal content might have changed.
                updatePayload.push(key, newVal);
                hasChanges = true;
            }
            else if (oldVal && newVal && typeof oldVal === 'object' && typeof newVal === 'object') {
                if (!deepEqual(oldVal, newVal)) {
                    updatePayload.push(key, newVal);
                    hasChanges = true;
                }
            }
            else {
                updatePayload.push(key, newVal);
                hasChanges = true;
            }
        }
    }
    // Check for new props
    for (const key in newProps) {
        if (key === 'children')
            continue;
        if (!(key in oldProps)) {
            updatePayload.push(key, newProps[key]);
            hasChanges = true;
        }
    }
    return hasChanges ? updatePayload : null;
}
const createHostConfig = () => {
    return {
        now: Date.now,
        supportsMutation: true,
        getPublicInstance: (inst) => inst,
        getRootHostContext: (root) => null,
        getChildHostContext: (parentHostContext, type, root) => null,
        shouldSetTextContent: (type, props) => false,
        createInstance: (type, props, container) => {
            return container.createInstance(type, props);
        },
        createTextInstance: (text, container) => {
            return container.createTextInstance(text);
        },
        appendInitialChild: (parent, child) => {
            child.parent = parent;
            parent.children.push(child);
            if (parent.container) {
                parent.container.changedNodes.add(parent);
            }
        },
        finalizeInitialChildren: (instance, type, props, rootContainer, hostContext) => false,
        appendChildToContainer: (container, child) => {
            container.appendChildToContainer(child);
        },
        appendChild: (parent, child) => {
            if (parent.container) {
                parent.container.appendChild(parent, child);
            }
            else {
                child.parent = parent;
                parent.children.push(child);
                // If parent already has a container, ensure child is marked or container updated
                const container = parent.container;
                if (container) {
                    container.changedNodes.add(parent);
                }
            }
        },
        insertBefore: (parent, child, beforeChild) => {
            if (parent.container) {
                parent.container.insertBefore(parent, child, beforeChild);
            }
            else {
                child.parent = parent;
                const i = parent.children.indexOf(beforeChild);
                if (i >= 0) {
                    parent.children.splice(i, 0, child);
                }
                else {
                    parent.children.push(child);
                }
            }
        },
        removeChild: (parent, child) => {
            if (parent.container) {
                parent.container.removeChild(parent, child);
            }
            else {
                const i = parent.children.indexOf(child);
                if (i >= 0)
                    parent.children.splice(i, 1);
                child.destroy();
            }
        },
        removeChildFromContainer: (container, child) => {
            container.removeChildFromContainer(child);
        },
        insertInContainerBefore: (container, child, beforeChild) => {
            container.appendChildToContainer(child);
        },
        resetTextContent: (instance) => {
        },
        detachDeletedInstance: (instance) => {
            instance.destroy();
        },
        clearContainer: (container) => {
            container.root = null;
        },
        prepareUpdate: (instance, type, oldProps, newProps, root, hostContext) => {
            return diffProps(oldProps, newProps);
        },
        updateFiberProps: (instance, type, newProps) => {
            instance.applyProps(newProps);
        },
        commitUpdate: (instance, updatePayload, type, oldProps, newProps, internalInstanceHandle) => {
            // Update props on the Node instance
            instance.applyProps(newProps);
            // Only mark as changed if there was an actual payload (calculated in prepareUpdate)
            if (updatePayload && instance.container) {
                // Optimization: check if only functions changed. 
                // If only functions changed, their representation in DSL (id, eventKey) 
                // remains the same, so we don't necessarily need a new Flutter patch 
                // unless the UI needs to reflect something.
                // For now, we always mark changed if diffProps returned a payload to be safe.
                const container = instance.container;
                if (typeof container.markChanged === 'function') {
                    container.markChanged(instance);
                }
                else {
                    container.changedNodes.add(instance);
                }
            }
        },
        commitTextUpdate: (textInstance, oldText, newText) => {
            textInstance.props.text = String(newText);
            if (textInstance.container) {
                textInstance.container.commitTextUpdate(textInstance, newText);
            }
        },
        resetAfterCommit: (container) => {
            // console.log(`[HostConfig] Commit finished for page ${container.pageId}, changed nodes: ${container.changedNodes.size}`);
            container.commit();
        },
        prepareForCommit: (container) => {
        },
        supportsHydration: false,
    };
};
exports.createHostConfig = createHostConfig;
