import { PageContainer } from './PageContainer';

export const TEXT_TYPE = 'Text';
let nextNodeId = 1;

export class Node {
  id: number;
  type: string;
  props: any;
  children: Node[] = [];
  parent?: Node;
  container?: PageContainer;
  private eventKeys: Set<string> = new Set();

  constructor(type: string, props: any, container?: PageContainer) {
    this.id = (props && typeof props.id === 'number') ? props.id : nextNodeId++;
    this.type = type;
    this.props = {}; // Initialize empty props
    this.container = container;
    this.container?.registerNode(this);
    this.applyProps(props);
  }

  applyProps(newProps: any) {
    if (this.type.includes('gesture-detector') || this.type.includes('ink-well')) {
      console.log(`[Node] applyProps for ${this.type} (${this.id}), keys:`, Object.keys(newProps || {}));
    }

    // Unregister old refId if it exists
    const oldRefId = this.props?.refId;
    if (oldRefId) {
      this.container?.unregisterNode(this);
    }

    this.clearCallbacks();
    // Re-initialize props to ensure deleted props are removed
    this.props = {};

    if (newProps) {
      const propKeys = Object.keys(newProps);
      for (const key of propKeys) {
        if (key === 'children') continue;
        const value = newProps[key];
        this.props[key] = value;
        if (typeof value === 'function') {
          if (this.type.includes('gesture-detector') || this.type.includes('ink-well')) {
            console.log(`[Node] Saved callback for ${this.type}.${key}`);
          }
          this.saveCallback(key, value);
        }
      }
    }

    // Re-register with new refId
    this.container?.registerNode(this);
    this.container?.markChanged(this);
  }

  saveCallback(key: string, fn: Function) {
    this.eventKeys.add(key);
    this.container?.registerCallback(this.id, key, fn);
  }

  clearCallbacks() {
    if (this.container) {
      for (const key of this.eventKeys) {
        this.container.unregisterCallback(this.id, key);
      }
    }
    this.eventKeys.clear();
  }

  getCallback(key: string): Function | undefined {
    return this.container?.getCallback(this.id, key);
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

    const props = this.container ? this.container.processProps(this.id, this.props, type) : {};

    // Use refId from props if provided
    const refId = this.props?.refId;

    // Children are handled separately
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

    const result: any = {
      id: this.id,
      type: String(type),
      props: props,
      children: children
    };

    if (refId) {
      const rawRefId = String(refId);
      const pageId = this.container?.pageId || 0;
      result.refId = rawRefId.indexOf(':') !== -1 ? rawRefId : `${pageId}:${rawRefId}`;
    }

    if (this.props?.isBoundary) {
      result.isBoundary = true;
    }

    return result;
  }

  destroy() {
    this.clearCallbacks();
    this.container?.unregisterNode(this);
    for (const child of this.children) {
      child.destroy();
    }
  }
}
