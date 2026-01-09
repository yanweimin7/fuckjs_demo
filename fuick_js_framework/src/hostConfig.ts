import Reconciler from 'react-reconciler';

const TEXT_TYPE = 'Text';

interface Node {
  type: string;
  props: any;
  children: Node[];
}

function makeNode(type: string, props: any): Node {
  const p = { ...(props || {}) };
  return { type, props: p, children: [] };
}

function applyProps(node: Node, newProps: any) {
  node.props = { ...(newProps || {}) };
}

export const createHostConfig = (onCommit: (pageId: number, root: Node | null) => void): any => {
  return {
    now: Date.now,
    supportsMutation: true,
    getPublicInstance: (inst: any) => inst,
    getRootHostContext: (root: any) => null,
    getChildHostContext: (parentHostContext: any, type: string, root: any) => null,
    shouldSetTextContent: (type: string, props: any) => false,
    createInstance: (type: string, props: any, root: any, hostContext: any, internalInstanceHandle: any) => {
      return makeNode(type, props);
    },
    createTextInstance: (text: string, root: any, hostContext: any, internalInstanceHandle: any) => {
      return makeNode(TEXT_TYPE, { text });
    },
    appendInitialChild: (parent: Node, child: Node) => {
      parent.children.push(child);
    },
    finalizeInitialChildren: (instance: Node, type: string, props: any, rootContainer: any, hostContext: any) => false,
    appendChildToContainer: (container: any, child: Node) => {
      container.root = child;
    },
    appendChild: (parent: Node, child: Node) => {
      parent.children.push(child);
    },
    insertBefore: (parentInstance: Node, child: Node, beforeChild: Node) => {
      const i = parentInstance.children.indexOf(beforeChild);
      if (i >= 0) {
        parentInstance.children.splice(i, 0, child);
      } else {
        parentInstance.children.push(child);
      }
    },
    removeChild: (parentInstance: Node, child: Node) => {
      const i = parentInstance.children.indexOf(child);
      if (i >= 0) parentInstance.children.splice(i, 1);
    },
    removeChildFromContainer: (container: any, child: Node) => {
      if (container.root === child) {
        container.root = null;
      }
    },
    insertInContainerBefore: (container: any, child: Node, beforeChild: Node) => {
      container.root = child;
    },
    resetTextContent: (instance: Node) => {
      // No-op for our DSL
    },
    detachDeletedInstance: (instance: Node) => {
      // No-op
    },
    clearContainer: (container: any) => {
      container.root = null;
    },
    prepareUpdate: (instance: Node, type: string, oldProps: any, newProps: any, root: any, hostContext: any) => {
      return true;
    },
    commitUpdate: (instance: Node, updatePayload: any, type: string, oldProps: any, newProps: any, internalInstanceHandle: any) => {
      applyProps(instance, newProps);
    },
    commitTextUpdate: (textInstance: Node, oldText: string, newText: string) => {
      textInstance.props.text = String(newText);
    },
    resetAfterCommit: (container: any) => {
      console.log(`[HostConfig] Commit finished for page ${container.pageId}`);
      if (typeof onCommit === 'function') {
        onCommit(container.pageId, container.root);
      }
    },
    prepareForCommit: (container: any) => {
    },
    supportsHydration: false,
  } as any;
};
