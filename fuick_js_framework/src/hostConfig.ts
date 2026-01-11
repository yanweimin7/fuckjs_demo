import React from 'react';
import { PageContainer } from './PageContainer';

export const TEXT_TYPE = 'Text';
let nextNodeId = 1;

const allNodes = new Map<number, Node>();

export function getNodeById(id: number): Node | undefined {
  return allNodes.get(id);
}

export class Node {
  id: number;
  type: string;
  props: any;
  children: Node[] = [];
  parent?: Node;
  container?: PageContainer;
  private eventCallbacks: Map<string, Function> = new Map();

  constructor(type: string, props: any, container?: PageContainer) {
    this.id = nextNodeId++;
    this.type = type;
    this.props = {}; // Initialize empty props
    this.container = container;
    allNodes.set(this.id, this);
    this.applyProps(props);
  }

  applyProps(newProps: any) {
    if (newProps) {
      // Use Object.assign to ensure all properties from newProps are copied, 
      // but filter out children as they are handled by reconciler.
      this.clearCallbacks();
      const propKeys = Object.keys(newProps);
      for (const key of propKeys) {
        if (key === 'children') continue;
        const value = newProps[key];
        this.props[key] = value;
        if (typeof value === 'function') {
          this.saveCallback(key, value);
        }
      }
    }
  }

  saveCallback(key: string, fn: Function) {
    this.eventCallbacks.set(key, fn);
  }

  clearCallbacks() {
    this.eventCallbacks.clear();
  }

  getCallback(key: string): Function | undefined {
    return this.eventCallbacks.get(key);
  }

  toDsl(): any {
    let type = this.type;
    if (!type) return null;

    // Strip 'flutter-' prefix and convert kebab-case to PascalCase for Flutter side recognition
    if (type.startsWith('flutter-')) {
      type = type.substring(8)
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
    }

    const props: any = {};
    if (this.props) {
      // Use for...in for maximum compatibility with all object types
      for (const key in this.props) {
        if (key === 'children') continue;
        if (key === 'key' || key === 'ref' || key === 'isBoundary') continue;

        const value = this.props[key];
        if (typeof value === 'function') {
          this.saveCallback(key, value);
          props[key] = { id: this.id, eventKey: key };
        } else if (key === 'style' && value && typeof value === 'object') {
          props[key] = { ...value };
        } else {
          props[key] = value;
        }
      }
    }

    // Inject node ID into props for stateful components like TextField to persist state
    props['__nodeId'] = this.id;

    const children: any[] = [];
    for (const child of this.children) {
      if (child.type === 'flutter-props') {
        const propsKey = child.props?.propsKey;
        if (propsKey) {
          const propChildren = child.children
            .map((c: any) => c.toDsl())
            .filter((c: any) => c !== null);

          if (propChildren.length > 0) {
            const newValue = propChildren.length === 1 ? propChildren[0] : propChildren;
            if (props[propsKey]) {
              if (Array.isArray(props[propsKey])) {
                props[propsKey].push(newValue);
              } else {
                props[propsKey] = [props[propsKey], newValue];
              }
            } else {
              props[propsKey] = newValue;
            }
          }
        }
      } else {
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
        // Optimization: check if only functions changed. 
        // If only functions changed, their representation in DSL (id, eventKey) 
        // remains the same, so we don't necessarily need a new Flutter patch 
        // unless the UI needs to reflect something.
        // For now, we always mark changed if diffProps returned a payload to be safe.
        const container = instance.container as any;
        if (typeof container.markChanged === 'function') {
          container.markChanged(instance);
        } else {
          container.changedNodes.add(instance);
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


