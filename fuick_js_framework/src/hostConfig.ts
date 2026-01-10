import Reconciler from 'react-reconciler';

const TEXT_TYPE = 'Text';
let nextNodeId = 1;

export interface Node {
  id: number;
  type: string;
  props: any;
  children: Node[];
}

function makeNode(type: string, props: any): Node {
  const p = { ...(props || {}) };
  return { id: nextNodeId++, type, props: p, children: [] };
}

function applyProps(node: Node, newProps: any) {
  node.props = { ...(newProps || {}) };
}

function shallowEqual(a: any, b: any) {
  if (a === b) return true;
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (a[key] !== b[key]) {
      // Special case for style or nested objects
      if (typeof a[key] === 'object' && typeof b[key] === 'object') {
        if (!shallowEqual(a[key], b[key])) return false;
      } else {
        return false;
      }
    }
  }
  return true;
}

export const createHostConfig = (onCommit: (pageId: number, root: Node | null, changedNodes: Set<Node>) => void): any => {
  const changedNodes = new Set<Node>();

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
      parent.children.push(child);
      changedNodes.add(parent);
    },
    finalizeInitialChildren: (instance: Node, type: string, props: any, rootContainer: any, hostContext: any) => false,
    appendChildToContainer: (container: any, child: Node) => {
      container.root = child;
      changedNodes.add(child);
    },
    appendChild: (parent: Node, child: Node) => {
      parent.children.push(child);
      changedNodes.add(parent);
    },
    insertBefore: (parentInstance: Node, child: Node, beforeChild: Node) => {
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
      changedNodes.add(parentInstance);
    },
    removeChildFromContainer: (container: any, child: Node) => {
      if (container.root === child) {
        container.root = null;
      }
    },
    insertInContainerBefore: (container: any, child: Node, beforeChild: Node) => {
      container.root = child;
      changedNodes.add(child);
    },
    resetTextContent: (instance: Node) => {
    },
    detachDeletedInstance: (instance: Node) => {
    },
    clearContainer: (container: any) => {
      container.root = null;
    },
    prepareUpdate: (instance: Node, type: string, oldProps: any, newProps: any, root: any, hostContext: any) => {
      if (shallowEqual(oldProps, newProps)) return null;
      return true;
    },
    commitUpdate: (instance: Node, updatePayload: any, type: string, oldProps: any, newProps: any, internalInstanceHandle: any) => {
      applyProps(instance, newProps);
      changedNodes.add(instance);
    },
    commitTextUpdate: (textInstance: Node, oldText: string, newText: string) => {
      textInstance.props.text = String(newText);
      changedNodes.add(textInstance);
    },
    resetAfterCommit: (container: any) => {
      console.log(`[HostConfig] Commit finished for page ${container.pageId}, changed nodes: ${changedNodes.size}`);
      if (typeof onCommit === 'function') {
        onCommit(container.pageId, container.root, new Set(changedNodes));
      }
      changedNodes.clear();
    },
    prepareForCommit: (container: any) => {
    },
    supportsHydration: false,
  } as any;
};
