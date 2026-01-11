import { Node, TEXT_TYPE } from './hostConfig';

export class PageContainer {
  pageId: number;
  root: Node | null = null;
  changedNodes: Set<Node> = new Set();
  rendered: boolean = false;

  constructor(pageId: number) {
    this.pageId = pageId;
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
      const rootChanged = this.changedNodes.has(this.root);

      if (!this.rendered || rootChanged) {
        const dsl = this.root.toDsl();
        if (dsl && dsl.type) {
          dartCallNative('renderUI', {
            pageId: Number(this.pageId),
            renderData: dsl
          });
          this.rendered = true;
        }
      } else {
        const patches: any[] = [];
        const processedNodes = new Set<number>();

        // Optimization: Only send patches for the top-most changed nodes.
        const topLevelChangedNodes: Node[] = [];
        for (const node of this.changedNodes) {
          let targetNode = node;
          // For flutter-props, we care about the parent component being updated
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
            // Also check if any flutter-props child of an ancestor is in changedNodes (rare but possible)
            current = current.parent;
          }
          if (!isRedundant) {
            // Avoid duplicates if multiple children of same parent changed
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
          if (targetNode === this.root) continue;

          const dsl = targetNode.toDsl();
          if (dsl) {
            // Force include children for boundary nodes that have children, 
            // even if only props were marked as changed.
            if (targetNode.props?.isBoundary && targetNode.children.length > 0 && !dsl.children) {
              const children: any[] = [];
              for (const child of targetNode.children) {
                const childDsl = child.toDsl();
                if (childDsl) children.push(childDsl);
              }
              dsl.children = children;
            }
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
