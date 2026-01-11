"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHostConfig = void 0;
const react_1 = __importDefault(require("react"));
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
                // Optimization: check if there are any changes that affect the DSL.
                // If only function references changed for existing event keys, 
                // the DSL (id, eventKey) remains the same, so no UI patch is needed.
                let hasDslChanges = false;
                for (let i = 0; i < updatePayload.length; i += 2) {
                    const key = updatePayload[i];
                    const newVal = updatePayload[i + 1];
                    const oldVal = oldProps[key];
                    // DSL changes if:
                    // 1. A prop was added or removed
                    // 2. A non-function prop changed
                    // 3. A prop changed from function to non-function (or vice versa)
                    if (!(key in oldProps) || newVal === null ||
                        typeof oldVal !== 'function' || typeof newVal !== 'function') {
                        hasDslChanges = true;
                        break;
                    }
                }
                if (hasDslChanges) {
                    const container = instance.container;
                    if (typeof container.markChanged === 'function') {
                        container.markChanged(instance);
                    }
                    else {
                        container.changedNodes.add(instance);
                    }
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
