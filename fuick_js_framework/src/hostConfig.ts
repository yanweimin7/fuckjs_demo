import React from 'react';
import { PageContainer } from './PageContainer';
import { Node, TEXT_TYPE } from './node';

function deepEqual(objA: any, objB: any): boolean {
  if (objA === objB) return true;
  if (!objA || !objB || typeof objA !== 'object' || typeof objB !== 'object') return false;

  // Handle React elements - we already handle them in diffProps, 
  // but if they end up here, we should treat them as not equal if references differ.
  if (React.isValidElement(objA) || React.isValidElement(objB)) return objA === objB;

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(objB, key)) return false;

    const valA = objA[key];
    const valB = objB[key];

    // Recursively check for deep equality
    if (valA && valB && typeof valA === 'object' && typeof valB === 'object') {
      if (!deepEqual(valA, valB)) return false;
    } else if (valA !== valB) {
      return false;
    }
  }

  return true;
}

function diffProps(oldProps: any, newProps: any): any[] | null {
  const updatePayload: any[] = [];
  let hasChanges = false;

  // Check for deleted or changed props
  for (const key in oldProps) {
    if (key === 'children') continue;
    if (!(key in newProps)) {
      updatePayload.push(key, null);
      hasChanges = true;
    } else if (oldProps[key] !== newProps[key]) {
      // Special check for functions/objects
      const oldVal = oldProps[key];
      const newVal = newProps[key];

      if (typeof oldVal === 'function' && typeof newVal === 'function') {
        // Even if the function reference changed, we might not need a Flutter patch
        // if the representation is the same. But we need to update JS side callbacks.
        updatePayload.push(key, newVal);
        hasChanges = true;
      } else if (React.isValidElement(oldVal) || React.isValidElement(newVal)) {
        // If it's a JSX element (React element), we should treat it as changed
        // as its internal content might have changed.
        updatePayload.push(key, newVal);
        hasChanges = true;
      } else if (oldVal && newVal && typeof oldVal === 'object' && typeof newVal === 'object') {
        if (!deepEqual(oldVal, newVal)) {
          updatePayload.push(key, newVal);
          hasChanges = true;
        }
      } else {
        updatePayload.push(key, newVal);
        hasChanges = true;
      }
    }
  }

  // Check for new props
  for (const key in newProps) {
    if (key === 'children') continue;
    if (!(key in oldProps)) {
      updatePayload.push(key, newProps[key]);
      hasChanges = true;
    }
  }

  return hasChanges ? updatePayload : null;
}

export const createHostConfig = (): any => {
  return {
    now: Date.now,
    supportsMutation: true,
    getPublicInstance: (inst: any) => inst,
    getRootHostContext: (root: any) => null,
    getChildHostContext: (parentHostContext: any, type: string, root: any) => null,
    shouldSetTextContent: (type: string, props: any) => false,
    createInstance: (type: string, props: any, container: PageContainer) => {
      return container.createInstance(type, props);
    },
    createTextInstance: (text: string, container: PageContainer) => {
      return container.createTextInstance(text);
    },
    appendInitialChild: (parent: Node, child: Node) => {
      child.parent = parent;
      parent.children.push(child);
      if (parent.container) {
        parent.container.changedNodes.add(parent);
      }
    },
    finalizeInitialChildren: (instance: Node, type: string, props: any, rootContainer: PageContainer, hostContext: any) => false,
    appendChildToContainer: (container: PageContainer, child: Node) => {
      container.appendChildToContainer(child);
    },
    appendChild: (parent: Node, child: Node) => {
      if (parent.container) {
        parent.container.appendChild(parent, child);
      } else {
        child.parent = parent;
        parent.children.push(child);
        // If parent already has a container, ensure child is marked or container updated
        const container = parent.container as any;
        if (container) {
          container.changedNodes.add(parent);
        }
      }
    },
    insertBefore: (parent: Node, child: Node, beforeChild: Node) => {
      if (parent.container) {
        parent.container.insertBefore(parent, child, beforeChild);
      } else {
        child.parent = parent;
        const i = parent.children.indexOf(beforeChild);
        if (i >= 0) {
          parent.children.splice(i, 0, child);
        } else {
          parent.children.push(child);
        }
      }
    },
    removeChild: (parent: Node, child: Node) => {
      if (parent.container) {
        parent.container.removeChild(parent, child);
      } else {
        const i = parent.children.indexOf(child);
        if (i >= 0) parent.children.splice(i, 1);
        child.destroy();
      }
    },
    removeChildFromContainer: (container: PageContainer, child: Node) => {
      container.removeChildFromContainer(child);
    },
    insertInContainerBefore: (container: PageContainer, child: Node, beforeChild: Node) => {
      container.appendChildToContainer(child);
    },
    resetTextContent: (instance: Node) => {
    },
    detachDeletedInstance: (instance: Node) => {
      instance.destroy();
    },
    clearContainer: (container: PageContainer) => {
      container.root = null;
    },
    prepareUpdate: (instance: Node, type: string, oldProps: any, newProps: any, root: any, hostContext: any) => {
      return diffProps(oldProps, newProps);
    },
    updateFiberProps: (instance: Node, type: string, newProps: any) => {
      instance.applyProps(newProps);
    },
    commitUpdate: (instance: Node, updatePayload: any, type: string, oldProps: any, newProps: any, internalInstanceHandle: any) => {
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
          const container = instance.container as any;
          if (typeof container.markChanged === 'function') {
            container.markChanged(instance);
          } else {
            container.changedNodes.add(instance);
          }
        }
      }
    },
    commitTextUpdate: (textInstance: Node, oldText: string, newText: string) => {
      textInstance.props.text = String(newText);
      if (textInstance.container) {
        textInstance.container.commitTextUpdate(textInstance, newText);
      }
    },
    resetAfterCommit: (container: PageContainer) => {
      // console.log(`[HostConfig] Commit finished for page ${container.pageId}, changed nodes: ${container.changedNodes.size}`);
      container.commit();
    },
    prepareForCommit: (container: PageContainer) => {
    },
    supportsHydration: false,
  } as any;
};


