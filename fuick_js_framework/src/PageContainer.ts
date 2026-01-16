import React from 'react';
import { Node, TEXT_TYPE } from './node';

export class PageContainer {
  pageId: number;
  root: Node | null = null;
  changedNodes: Set<Node> = new Set();
  rendered: boolean = false;
  incrementalMode: boolean = false;
  mutationQueue: any[] = [];

  private eventCallbacks: Map<string, Function> = new Map();
  private onVisibleCallbacks: Set<Function> = new Set();
  private onInvisibleCallbacks: Set<Function> = new Set();
  private nodes: Map<number | string, Node> = new Map();
  private nodesByRefId: Map<string, Node> = new Map();
  private virtualNodeIdCounter: number = 1000000; // Start high for virtual nodes
  private isVisible: boolean = false;

  constructor(pageId: number) {
    this.pageId = pageId;
  }

  public registerNode(node: Node) {
    this.nodes.set(node.id, node);
    if (node.props?.refId) {
      this.nodesByRefId.set(node.props.refId, node);
    }
  }

  public unregisterNode(node: Node) {
    this.nodes.delete(node.id);
    if (node.props?.refId) {
      this.nodesByRefId.delete(node.props.refId);
    }
  }

  public getNodeByRefId(refId: string): Node | undefined {
    return this.nodesByRefId.get(refId);
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

  public registerVisibleCallback(fn: Function) {
    this.onVisibleCallbacks.add(fn);
    if (this.isVisible) {
      try {
        fn();
      } catch (e) {
        console.error(`Error in onVisible callback (immediate) for page ${this.pageId}:`, e);
      }
    }
  }

  public unregisterVisibleCallback(fn: Function) {
    this.onVisibleCallbacks.delete(fn);
  }

  public registerInvisibleCallback(fn: Function) {
    this.onInvisibleCallbacks.add(fn);
  }

  public unregisterInvisibleCallback(fn: Function) {
    this.onInvisibleCallbacks.delete(fn);
  }

  public notifyVisible() {
    this.isVisible = true;
    this.onVisibleCallbacks.forEach(fn => {
      try {
        fn();
      } catch (e) {
        console.error(`Error in onVisible callback for page ${this.pageId}:`, e);
      }
    });
  }

  public notifyInvisible() {
    this.isVisible = false;
    this.onInvisibleCallbacks.forEach(fn => {
      try {
        fn();
      } catch (e) {
        console.error(`Error in onInvisible callback for page ${this.pageId}:`, e);
      }
    });
  }

  public setIncrementalMode(enabled: boolean) {
    this.incrementalMode = enabled;
  }

  public recordUpdate(node: Node, updatePayload: any[]) {
    if (!this.incrementalMode) {
      this.markChanged(node);
      return;
    }

    const props: any = {};
    for (let i = 0; i < updatePayload.length; i += 2) {
      const key = updatePayload[i];
      const val = updatePayload[i + 1];
      if (key === 'children') continue;
      props[key] = val;
    }

    // Use processProps to handle callbacks and conversions
    const processed = this.processProps(node.id, props, node.type);

    // OpCode 1: UPDATE (id, props)
    this.mutationQueue.push(1, node.id, processed);
  }

  public recordPlacement(parent: Node, child: Node, index: number) {
    if (!this.incrementalMode) {
      this.markChanged(parent);
      return;
    }
    const childDsl = child.toDsl();
    // OpCode 2: INSERT (parentId, childId, index, childDsl)
    this.mutationQueue.push(2, parent.id, child.id, index, childDsl);
  }

  public recordRemoval(parent: Node, child: Node) {
    if (!this.incrementalMode) {
      this.markChanged(parent);
      return;
    }
    // OpCode 3: REMOVE (parentId, childId)
    this.mutationQueue.push(3, parent.id, child.id);
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
        if (this.incrementalMode) {
          this.recordRemoval(child.parent, child);
        } else {
          this.markChanged(child.parent);
        }
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
    if (this.incrementalMode) {
      this.recordPlacement(parent, child, parent.children.length - 1);
    } else {
      this.markChanged(parent);
    }
  }

  insertBefore(parent: Node, child: Node, beforeChild: Node) {
    // If child already has a parent, remove it first (handle moves)
    if (child.parent) {
      const oldIndex = child.parent.children.indexOf(child);
      if (oldIndex >= 0) {
        child.parent.children.splice(oldIndex, 1);
        // If it's the same parent, we will mark it changed later with the new insertion
        if (child.parent !== parent) {
          if (this.incrementalMode) {
            this.recordRemoval(child.parent, child);
          } else {
            this.markChanged(child.parent);
          }
        } else {
          // Same parent move. In incremental mode, we still need REMOVE + INSERT?
          // Or just INSERT (if simplified)?
          // Usually move = remove + insert.
          if (this.incrementalMode) {
            this.recordRemoval(parent, child);
          }
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

    if (this.incrementalMode) {
      // If i is -1, it was pushed, index is length-1
      const newIndex = i >= 0 ? i : parent.children.length - 1;
      this.recordPlacement(parent, child, newIndex);
    } else {
      this.markChanged(parent);
    }
  }

  removeChild(parent: Node, child: Node) {
    const i = parent.children.indexOf(child);
    if (i >= 0) parent.children.splice(i, 1);
    child.destroy();

    if (this.incrementalMode) {
      this.recordRemoval(parent, child);
    } else {
      this.markChanged(parent);
    }
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
      if (this.incrementalMode) {
        const rootChanged = this.root && this.changedNodes.has(this.root);
        if ((!this.rendered || rootChanged) && this.root) {
          const dsl = this.root.toDsl();
          if (dsl && dsl.type) {
            dartCallNative('renderUI', {
              pageId: Number(this.pageId),
              renderData: dsl
            });
            this.rendered = true;
          }
        } else if (this.mutationQueue.length > 0) {
          if (typeof dartCallNative === 'function') {
            dartCallNative('patchOps', {
              pageId: Number(this.pageId),
              ops: this.mutationQueue
            });
            this.mutationQueue = [];
          }
        }
        return;
      }

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

        // Optimization: Normalize changed nodes (handle flutter-props)
        const normalizedChangedNodes = new Set<Node>();
        for (const node of this.changedNodes) {
          // If a flutter-props node changed, it means its parent (the host component) needs to update
          // to reflect the new property value in its DSL.
          if ((node.type === 'FlutterProps' || node.type === 'flutter-props') && node.parent) {
            normalizedChangedNodes.add(node.parent);
          } else {
            normalizedChangedNodes.add(node);
          }
        }

        // Filter for top-level nodes only (avoid sending redundant child patches)
        const topLevelNodes = new Set<Node>();
        for (const node of normalizedChangedNodes) {
          let isRedundant = false;
          let current = node.parent;
          while (current) {
            if (normalizedChangedNodes.has(current)) {
              isRedundant = true;
              break;
            }
            current = current.parent;
          }
          if (!isRedundant) {
            topLevelNodes.add(node);
          }
        }

        for (const node of topLevelNodes) {
          if (processedNodes.has(node.id)) continue;

          const dsl = node.toDsl();
          if (dsl) {
            patches.push(dsl);
            processedNodes.add(node.id);
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

  public getItemDSL(refId: string, index: number): any {
    const node = this.getNodeByRefId(refId);
    if (!node) {
      return null;
    }

    const itemBuilder = node.props?.itemBuilder;
    if (typeof itemBuilder !== 'function') {
      return null;
    }

    try {
      const element = itemBuilder(index);
      const dsl = this.elementToDsl(element);
      return dsl;
    } catch (e) {
      console.error(`[PageContainer] Error in itemBuilder for refId ${refId} at index ${index}:`, e);
      return null;
    }
  }

  public elementToDsl(element: any, depth: number = 0): any {
    if (depth > 500) {
      console.error('[PageContainer] Maximum recursion depth exceeded in elementToDsl');
      return null;
    }
    if (!element) return null;

    if (typeof element === 'string' || typeof element === 'number') {
      return { type: 'Text', props: { text: String(element) } };
    }

    if (Array.isArray(element)) {
      return element.map(e => this.elementToDsl(e, depth + 1)).filter(e => e !== null);
    }

    if (element.type) {
      let type = element.type;
      const originalProps = element.props || {};

      // Handle React.memo and React.forwardRef (can be nested)
      while (typeof type === 'object' && type !== null && type.type) {
        type = type.type;
      }

      if (typeof type === 'function') {
        // Handle class components
        if (type.prototype && type.prototype.isReactComponent) {
          const instance = new (type as any)(originalProps);
          instance.context = { pageId: this.pageId };

          // Support refs in elementToDsl (important for itemBuilder)
          if (element.ref) {
            if (typeof element.ref === 'function') {
              element.ref(instance);
            } else if (typeof element.ref === 'object' && element.ref !== null) {
              (element.ref as any).current = instance;
            }
          }

          return this.elementToDsl(instance.render(), depth + 1);
        }
        // Handle functional components
        return this.elementToDsl((type as any)(originalProps), depth + 1);
      }

      // It's a primitive (string) type
      const props = { ...originalProps };
      const children = props.children;
      delete props.children;

      // Ensure we have a nodeId for event mapping
      const nodeId = (typeof props.id === 'number') ? props.id : ++this.virtualNodeIdCounter;
      if (!props.id || typeof props.id !== 'number') props.id = nodeId;

      if (typeof type === 'string' && type.startsWith('flutter-')) {
        type = type.substring(8)
          .split('-')
          .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
          .join('');
      }

      // Process props using the common logic
      const processedProps = this.processProps(nodeId, props, type, '', depth + 1);

      const dslChildren: any[] = [];
      const childrenToProcess = Array.isArray(children) ? children : (children ? [children] : []);

      for (const child of childrenToProcess) {
        const childDsl = this.elementToDsl(child, depth + 1);
        if (childDsl) {
          if (Array.isArray(childDsl)) {
            dslChildren.push(...childDsl);
          } else {
            dslChildren.push(childDsl);
          }
        }
      }

      const result = {
        id: nodeId,
        type: String(type),
        props: processedProps,
        children: dslChildren
      };

      if (props.refId) {
        const rawRefId = String(props.refId);
        (result as any).refId = rawRefId.indexOf(':') !== -1 ? rawRefId : `${this.pageId}:${rawRefId}`;
      }

      if (props.isBoundary) {
        (result as any).isBoundary = true;
      }

      return result;
    }

    return null;
  }

  /**
   * 递归处理组件属性，将 React/JS 特有的属性转换为 Flutter 可识别的 DSL 格式
   * 
   * 处理逻辑包括：
   * 1. 识别并转换函数回调为 Flutter 事件对象 (isFuickEvent)
   * 2. 递归处理嵌套的对象和数组
   * 3. 过滤掉 React 内部使用的私有属性
   * 4. 处理嵌套的 React 元素 (Element to DSL)
   * 
   * @param nodeId 当前属性所属节点的 ID，用于事件回调定位
   * @param props 原始属性对象
   * @param nodeType 节点类型 (如 'ListView', 'Text')，用于特殊逻辑处理
   * @param path 当前处理的属性路径 (如 'decoration.color')，用于生成唯一的事件 key
   * @returns 处理后的 DSL 属性对象
   */
  processProps(nodeId: number, props: any, nodeType?: string, path: string = '', depth: number = 0): any {
    if (depth > 500) {
      console.error('[PageContainer] Maximum recursion depth exceeded in processProps');
      return null;
    }
    // Case 1: 基础类型或空值直接返回
    if (!props || typeof props !== 'object') return props;

    // Case 2: 如果属性值是一个 React 元素，将其转换为 DSL 结构
    // 例如：AppBar 的 title 属性传入了一个 <Text> 组件
    if (React.isValidElement(props)) return this.elementToDsl(props, depth + 1);

    // Case 3: 处理数组，递归转换数组中的每个元素
    if (Array.isArray(props)) {
      return props.map((item, index) => this.processProps(nodeId, item, nodeType, path ? `${path}[${index}]` : `[${index}]`, depth + 1));
    }

    const processedProps: any = {};
    for (const key in props) {
      // Case 4: 过滤 React 内部属性
      // children 已在 elementToDsl 中单独处理，key/ref/isBoundary 仅在 JS 层使用，不传递给 Flutter
      if (path === '' && (key === 'children' || key === 'key' || key === 'ref' || key === 'isBoundary')) continue;

      // Case 5: 列表类组件的 itemBuilder 特殊处理
      // itemBuilder 是按需调用的数据源，不是普通点击事件，不应被转换为 Flutter Event 对象。
      // 它会在 Flutter 侧通过 getItemDSL 接口反向调用 JS 来获取每一项的 DSL。
      if (key === 'itemBuilder') {
        continue;
      }

      const value = props[key];
      // 生成完整的属性路径，用于事件回调时精准定位
      const fullKey = path ? `${path}.${key}` : key;

      if (typeof value === 'function') {
        // Case 6: 处理函数回调
        // 将 JS 函数注册到 PageContainer，并返回一个 Flutter 可识别的事件协议对象
        this.registerCallback(nodeId, fullKey, value);

        // 构造 Flutter 侧解析的事件描述对象
        processedProps[key] = {
          "id": Number(nodeId),        // 节点 ID
          "nodeId": Number(nodeId),    // 节点 ID (兼容性保留)
          "eventKey": String(fullKey), // 唯一的事件标识符 (包含路径)
          "pageId": Number(this.pageId), // 页面 ID
          "isFuickEvent": true         // 标识这是一个需要 JS 回调的事件
        };
      } else if (value && typeof value === 'object') {
        // Case 7: 递归处理嵌套对象
        // 例如：decoration: { color: '#ff0000', border: { ... } }
        processedProps[key] = this.processProps(nodeId, value, nodeType, fullKey, depth + 1);
      } else {
        // Case 8: 基础数据类型 (string, number, boolean) 直接赋值
        processedProps[key] = value;
      }
    }
    return processedProps;
  }

  clear() {
    this.changedNodes.clear();
    this.mutationQueue = [];
  }
}
