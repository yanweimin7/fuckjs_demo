import React from 'react';
import { PageContainer } from './PageContainer';
import { Node, TEXT_TYPE } from './node';

function deepEqual(objA: any, objB: any): boolean {
  if (objA === objB) return true;
  if (!objA || !objB || typeof objA !== 'object' || typeof objB !== 'object') return false;

  // Handle React elements - perform deep comparison
  if (React.isValidElement(objA) || React.isValidElement(objB)) {
    return false;
  }

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

/**
 * 对比新旧属性，计算出更新 Payload 以及是否影响 DSL 布局。
 * 
 * 核心逻辑：
 * 1. 只有属性值真正发生变化（浅比较或深度比较）时，才会被加入 payload，用于更新 JS 侧的 Node 属性。
 * 2. 引入 `hasDslChanges` 标记，用于区分“逻辑更新”和“UI更新”：
 *    - 如果只是回调函数（Function）的引用变化，虽然需要更新 JS 侧的事件注册表，但生成的 DSL（eventKey）是不变的，
 *      因此不需要通知 Flutter 重绘 UI（hasDslChanges = false）。
 *    - 如果是基础类型、React Element 或普通对象的实质性结构变化，则必须通知 Flutter 更新 UI（hasDslChanges = true）。
 */
function diffProps(oldProps: any, newProps: any): { payload: any[], hasDslChanges: boolean } | null {
  const updatePayload: any[] = [];
  let hasChanges = false;
  let hasDslChanges = false;

  // 1. 遍历旧属性，检查是否有被删除或被修改的属性
  for (const key in oldProps) {
    if (key === 'children') continue; // children 单独处理，不在此处 diff

    // 情况 A: 属性被删除
    if (!(key in newProps)) {
      updatePayload.push(key, null);
      hasChanges = true;
      hasDslChanges = true; // 属性删除必然影响 DSL 结构
    }
    // 情况 B: 属性值引用发生变化
    else if (oldProps[key] !== newProps[key]) {
      const oldVal = oldProps[key];
      const newVal = newProps[key];

      // B1: 新旧值都是函数
      if (typeof oldVal === 'function' && typeof newVal === 'function') {
        // 函数引用变化需要更新 JS 侧的回调映射，但对于 DSL 来说，
        // eventKey (如 "onClick") 依然指向同一个 ID，因此不算作 DSL 变更。
        // 从而避免不必要的 Flutter UI 刷新。
        updatePayload.push(key, newVal);
        hasChanges = true;

        // Special Case: itemBuilder change implies data source change, must update UI
        if (key === 'itemBuilder') {
          hasDslChanges = true;
        }
      }
      // B2: 涉及 React Element (组件)
      else if (React.isValidElement(oldVal) || React.isValidElement(newVal)) {
        // 如果属性是 React 组件（如 title={<Text />}），只要引用变了，就直接视为 DSL 变更。
        // 为了性能，不做昂贵的深度递归比较 (Deep Compare)。
        updatePayload.push(key, newVal);
        hasChanges = true;
        hasDslChanges = true;
      }
      // B3: 普通对象或数组
      else if (oldVal && newVal && typeof oldVal === 'object' && typeof newVal === 'object') {
        // 先进行标准深度比较，确认内容是否真的变了
        if (!deepEqual(oldVal, newVal)) {
          updatePayload.push(key, newVal);
          hasChanges = true;

          // 如果内容变了，进一步检查是否仅仅是内部的函数引用变了？
          // isDslEqual 会忽略函数引用的差异。
          // 如果 isDslEqual 返回 false，说明有非函数的实质性数据变化，需要更新 UI。
          if (!isDslEqual(oldVal, newVal)) {
            hasDslChanges = true;
          }
        }
      }
      // B4: 基础数据类型 (String, Number, Boolean 等)
      else {
        updatePayload.push(key, newVal);
        hasChanges = true;
        hasDslChanges = true; // 基础类型变化必然影响 UI
      }
    }
  }

  // 2. 遍历新属性，检查是否有新增的属性
  for (const key in newProps) {
    if (key === 'children') continue;
    if (!(key in oldProps)) {
      updatePayload.push(key, newProps[key]);
      hasChanges = true;
      hasDslChanges = true; // 新增属性必然影响 DSL
    }
  }

  return hasChanges ? { payload: updatePayload, hasDslChanges } : null;
}

function isDslEqual(valA: any, valB: any): boolean {
  if (valA === valB) return true;

  // Treat functions as equal for DSL purposes (eventKey doesn't change if function ref changes)
  if (typeof valA === 'function' && typeof valB === 'function') return true;

  if (!valA || !valB || typeof valA !== 'object' || typeof valB !== 'object') return false;

  // React Element check
  if (React.isValidElement(valA) || React.isValidElement(valB)) {
    return false;
  }

  // Array check
  if (Array.isArray(valA) !== Array.isArray(valB)) return false;
  if (Array.isArray(valA)) {
    if (valA.length !== valB.length) return false;
    for (let i = 0; i < valA.length; i++) {
      if (!isDslEqual(valA[i], valB[i])) return false;
    }
    return true;
  }

  // Object check
  const keysA = Object.keys(valA);
  const keysB = Object.keys(valB);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(valB, key)) return false;
    if (!isDslEqual(valA[key], valB[key])) return false;
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
      return diffProps(oldProps, newProps);
    },
    updateFiberProps: (instance: Node, type: string, newProps: any) => {
      instance.applyProps(newProps);
    },
    commitUpdate: (instance: Node, updatePayload: { payload: any[], hasDslChanges: boolean }, type: string, oldProps: any, newProps: any, internalInstanceHandle: any) => {
      // Update props on the Node instance
      instance.applyProps(newProps);

      // Only mark as changed if there was an actual payload (calculated in prepareUpdate)
      if (updatePayload && instance.container) {
        // Optimization: check if there are any changes that affect the DSL.
        // If only function references changed for existing event keys, 
        // the DSL (id, eventKey) remains the same, so no UI patch is needed.
        if (updatePayload.hasDslChanges) {
          const container = instance.container as any;
          if (typeof container.recordUpdate === 'function') {
            container.recordUpdate(instance, updatePayload.payload);
          } else if (typeof container.markChanged === 'function') {
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


