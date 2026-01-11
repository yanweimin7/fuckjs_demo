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

function shallowEqual(a: any, b: any) {
  if (a === b) return true;
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return false;
  const keysA = Object.keys(a).filter(k => k !== 'children');
  const keysB = Object.keys(b).filter(k => k !== 'children');
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (Object.prototype.hasOwnProperty.call(b, key)) {
      const valA = a[key];
      const valB = b[key];
      if (valA !== valB) {
        // Optimization: If both are functions, their DSL representation is the same
        // { id: nodeId, eventKey: key }, so we can treat them as equal to avoid redundant updates.
        if (typeof valA === 'function' && typeof valB === 'function') {
          continue;
        }

        // Skip deep comparison for React elements to avoid performance issues or infinite loops
        if (React.isValidElement(valA) || React.isValidElement(valB)) {
          return false;
        }

        // Only recurse for plain objects that might be style/decoration
        if (
          valA && valB &&
          typeof valA === 'object' && typeof valB === 'object' &&
          !Array.isArray(valA) && !Array.isArray(valB) &&
          valA.constructor === Object && valB.constructor === Object
        ) {
          if (!shallowEqual(valA, valB)) return false;
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  }
  return true;
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
      // Return true if any prop changed (including functions) to ensure commitUpdate is called
      // and callbacks are updated. We will decide whether to trigger a Flutter patch in commitUpdate.
      if (oldProps === newProps) return null;
      return true;
    },
    updateFiberProps: (instance: Node, type: string, newProps: any) => {
      instance.applyProps(newProps);
    },
    commitUpdate: (instance: Node, updatePayload: any, type: string, oldProps: any, newProps: any, internalInstanceHandle: any) => {
      // Always apply props
      instance.applyProps(newProps);

      // Always mark as changed to be safe, PageContainer.markChanged will find the nearest boundary
      if (instance.container) {
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


