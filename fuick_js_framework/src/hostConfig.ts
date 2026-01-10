import Reconciler from 'react-reconciler';

const TEXT_TYPE = 'Text';
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
  private eventCallbacks: Map<string, Function> = new Map();

  constructor(type: string, props: any) {
    this.id = nextNodeId++;
    this.type = type;
    this.props = { ...(props || {}) };
    allNodes.set(this.id, this);
  }

  applyProps(newProps: any) {
    this.props = { ...(newProps || {}) };
  }

  saveCallback(key: string, fn: Function) {
    this.eventCallbacks.set(key, fn);
  }

  getCallback(key: string): Function | undefined {
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

function makeNode(type: string, props: any): Node {
  return new Node(type, props);
}

function applyProps(node: Node, newProps: any) {
  node.props = { ...(newProps || {}) };
}

function shallowEqual(a: any, b: any) {
  if (a === b) return true;
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return false;
  const keysA = Object.keys(a).filter(k => k !== 'children');
  const keysB = Object.keys(b).filter(k => k !== 'children');
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (Object.prototype.hasOwnProperty.call(b, key)) {
      if (a[key] !== b[key]) {
        // Only recurse for plain objects that might be style/decoration
        if (
          a[key] && b[key] &&
          typeof a[key] === 'object' && typeof b[key] === 'object' &&
          !Array.isArray(a[key]) && !Array.isArray(b[key]) &&
          a[key].constructor === Object && b[key].constructor === Object
        ) {
          if (!shallowEqual(a[key], b[key])) return false;
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

export const createHostConfig = (onCommit: (pageId: number, root: Node | null, changedNodes: Set<Node>, deletedIds: Set<number>) => void): any => {
  const changedNodes = new Set<Node>();
  const deletedIds = new Set<number>();

  return {
    now: Date.now,
    supportsMutation: true,
    getPublicInstance: (inst: any) => inst,
    getRootHostContext: (root: any) => null,
    getChildHostContext: (parentHostContext: any, type: string, root: any) => null,
    shouldSetTextContent: (type: string, props: any) => false,
    createInstance: (type: string, props: any, root: any, hostContext: any, internalInstanceHandle: any) => {
      const node = makeNode(type, props);
      changedNodes.add(node);
      return node;
    },
    createTextInstance: (text: string, root: any, hostContext: any, internalInstanceHandle: any) => {
      const node = makeNode(TEXT_TYPE, { text });
      changedNodes.add(node);
      return node;
    },
    appendInitialChild: (parent: Node, child: Node) => {
      child.parent = parent;
      parent.children.push(child);
      changedNodes.add(parent);
    },
    finalizeInitialChildren: (instance: Node, type: string, props: any, rootContainer: any, hostContext: any) => false,
    appendChildToContainer: (container: any, child: Node) => {
      container.root = child;
      changedNodes.add(child);
    },
    appendChild: (parent: Node, child: Node) => {
      child.parent = parent;
      parent.children.push(child);
      changedNodes.add(parent);
    },
    insertBefore: (parentInstance: Node, child: Node, beforeChild: Node) => {
      child.parent = parentInstance;
      const i = parentInstance.children.indexOf(beforeChild);
      if (i >= 0) {
        parentInstance.children.splice(i, 0, child);
      } else {
        parentInstance.children.push(child);
      }
      changedNodes.add(parentInstance);
    },
    removeChild: (parentInstance: Node, child: Node) => {
      const i = parentInstance.children.indexOf(child);
      if (i >= 0) parentInstance.children.splice(i, 1);
      deletedIds.add(child.id);
      child.destroy();
      changedNodes.add(parentInstance);
    },
    removeChildFromContainer: (container: any, child: Node) => {
      if (container.root === child) {
        container.root = null;
      }
      deletedIds.add(child.id);
      child.destroy();
    },
    insertInContainerBefore: (container: any, child: Node, beforeChild: Node) => {
      container.root = child;
      changedNodes.add(child);
    },
    resetTextContent: (instance: Node) => {
    },
    detachDeletedInstance: (instance: Node) => {
      deletedIds.add(instance.id);
      instance.destroy();
    },
    clearContainer: (container: any) => {
      if (container.root) {
        deletedIds.add(container.root.id);
      }
      container.root = null;
    },
    prepareUpdate: (instance: Node, type: string, oldProps: any, newProps: any, root: any, hostContext: any) => {
      if (shallowEqual(oldProps, newProps)) return null;
      return true;
    },
    updateFiberProps: (instance: Node, type: string, newProps: any) => {
      instance.applyProps(newProps);
      changedNodes.add(instance);
    },
    commitUpdate: (instance: Node, updatePayload: any, type: string, oldProps: any, newProps: any, internalInstanceHandle: any) => {
      instance.applyProps(newProps);
      changedNodes.add(instance);
    },
    commitTextUpdate: (textInstance: Node, oldText: string, newText: string) => {
      textInstance.props.text = String(newText);
      changedNodes.add(textInstance);
    },
    resetAfterCommit: (container: any) => {
      console.log(`[HostConfig] Commit finished for page ${container.pageId}, changed nodes: ${changedNodes.size}, deleted nodes: ${deletedIds.size}`);
      if (typeof onCommit === 'function') {
        onCommit(container.pageId, container.root, new Set(changedNodes), new Set(deletedIds));
      }
      changedNodes.clear();
      deletedIds.clear();
    },
    prepareForCommit: (container: any) => {
    },
    supportsHydration: false,
  } as any;
};
