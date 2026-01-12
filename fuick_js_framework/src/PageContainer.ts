import { Node, TEXT_TYPE } from './node';

export class PageContainer {
  pageId: number;
  root: Node | null = null;
  changedNodes: Set<Node> = new Set();
  rendered: boolean = false;
  private eventCallbacks: Map<string, Function> = new Map();

  constructor(pageId: number) {
    this.pageId = pageId;
  }

  public registerCallback(nodeId: number | string, eventKey: string, fn: Function) {
    this.eventCallbacks.set(`${nodeId}:${eventKey}`, fn);
  }

  public unregisterCallback(nodeId: number | string, eventKey: string) {
    this.eventCallbacks.delete(`${nodeId}:${eventKey}`);
  }

  public getCallback(nodeId: number | string, eventKey: string): Function | undefined {
    return this.eventCallbacks.get(`${nodeId}:${eventKey}`);
  }

  public markChanged(node: Node | null) {
    if (!node) return;
    let current = node;
    // Walk up until we find a boundary node or hit the root
    while (current.parent && !current.props?.isBoundary) {
      current = current.parent;
    }
    this.changedNodes.add(current);
  }

  createInstance(type: string, props: any): Node {
    const node = new Node(type, props, this);
    this.markChanged(node);
    return node;
  }

  createTextInstance(text: string): Node {
    const node = new Node(TEXT_TYPE, { text }, this);
    this.markChanged(node);
    return node;
  }

  appendChild(parent: Node, child: Node) {
    // If child already has a parent, remove it first (handle moves)
    if (child.parent) {
      const oldIndex = child.parent.children.indexOf(child);
      if (oldIndex >= 0) {
        child.parent.children.splice(oldIndex, 1);
        this.markChanged(child.parent);
      }
    } else {
      // Even if it doesn't have a parent, it might already be in this parent's children 
      // due to appendInitialChild or other reasons.
      const oldIndex = parent.children.indexOf(child);
      if (oldIndex >= 0) {
        parent.children.splice(oldIndex, 1);
      }
    }

    child.parent = parent;
    parent.children.push(child);
    this.markChanged(parent);
  }

  insertBefore(parent: Node, child: Node, beforeChild: Node) {
    // If child already has a parent, remove it first (handle moves)
    if (child.parent) {
      const oldIndex = child.parent.children.indexOf(child);
      if (oldIndex >= 0) {
        child.parent.children.splice(oldIndex, 1);
        // If it's the same parent, we will mark it changed later with the new insertion
        if (child.parent !== parent) {
          this.markChanged(child.parent);
        }
      }
    } else {
      // Ensure it's not already in the target parent's children
      const oldIndex = parent.children.indexOf(child);
      if (oldIndex >= 0) {
        parent.children.splice(oldIndex, 1);
      }
    }

    child.parent = parent;
    const i = parent.children.indexOf(beforeChild);
    if (i >= 0) {
      parent.children.splice(i, 0, child);
    } else {
      parent.children.push(child);
    }
    // ALWAYS mark parent as changed when children order or content changes
    this.markChanged(parent);
  }

  removeChild(parent: Node, child: Node) {
    const i = parent.children.indexOf(child);
    if (i >= 0) parent.children.splice(i, 1);
    child.destroy();
    this.markChanged(parent);
  }

  appendChildToContainer(child: Node) {
    this.root = child;
    this.markChanged(child);
  }

  removeChildFromContainer(child: Node) {
    if (this.root === child) {
      this.root = null;
    }
    child.destroy();
  }

  commitTextUpdate(node: Node, text: string) {
    node.props.text = String(text);
    this.markChanged(node);
  }


  commit() {
    try {
      if (this.changedNodes.size === 0) {
        return;
      }
      if (!this.root) {
        return;
      }

      if (typeof dartCallNative !== 'function') return;

      // If root node is in changedNodes or it's the initial render, use renderUI
      const rootChanged = this.root && this.changedNodes.has(this.root);

      if (!this.rendered || rootChanged) {
        const dsl = this.root?.toDsl();
        if (dsl && dsl.type) {
          dartCallNative('renderUI', {
            pageId: Number(this.pageId),
            renderData: dsl
          });
          this.rendered = true;
        }
      } else {
        const patches: any[] = [];
        const processedNodes = new Set<number | string>();

        // Optimization: Only send patches for the top-most changed nodes.
        const topLevelChangedNodes: Node[] = [];
        for (const node of this.changedNodes) {
          let targetNode = node;
          if (targetNode.type === 'flutter-props' && targetNode.parent) {
            targetNode = targetNode.parent;
          }

          let isRedundant = false;
          let current = targetNode.parent;
          while (current) {
            if (this.changedNodes.has(current)) {
              isRedundant = true;
              break;
            }
            current = current.parent;
          }
          if (!isRedundant) {
            if (!topLevelChangedNodes.includes(targetNode)) {
              topLevelChangedNodes.push(targetNode);
            }
          }
        }

        for (const node of topLevelChangedNodes) {
          if (processedNodes.has(node.id)) continue;

          let targetNode = node;
          if (targetNode.type === 'flutter-props') {
            if (targetNode.parent) {
              targetNode = targetNode.parent;
            } else {
              continue;
            }
          }

          if (processedNodes.has(targetNode.id)) continue;

          // Allow root node as patch if it's not rootChanged (shouldn't happen with current logic but for safety)
          const dsl = targetNode.toDsl();
          if (dsl) {
            patches.push(dsl);
            processedNodes.add(targetNode.id);
          }
        }

        if (patches.length > 0) {
          dartCallNative('patchUI', {
            pageId: Number(this.pageId),
            patches: patches
          });
        }
      }
    } catch (e) {
      console.error(`[PageContainer] Error during commit for page ${this.pageId}:`, e);
    } finally {
      this.clear();
    }
  }

  clear() {
    this.changedNodes.clear();
  }
}
