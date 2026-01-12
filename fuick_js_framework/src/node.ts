import { PageContainer } from './PageContainer';

export const TEXT_TYPE = 'Text';
let nextNodeId = 1;

export class Node {
  id: number | string;
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
    // If refId changes, we might need to update the container's refId map.
    // But refId is usually stable for a node.
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
          this.saveCallback(key, value);
        }
      }
    }

    // If we have a container, we should re-register to update refId mapping
    this.container?.registerNode(this);
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

    const props: any = {};
    if (this.props) {
      // Use for...in for maximum compatibility with all object types
      for (const key in this.props) {
        if (key === 'children') continue;
        if (key === 'key' || key === 'ref' || key === 'isBoundary') continue;

        const value = this.props[key];
        if (typeof value === 'function') {
          props[key] = { id: this.id, eventKey: key, pageId: this.container?.pageId };
        } else if (key === 'style' && value && typeof value === 'object') {
          props[key] = { ...value };
        } else {
          props[key] = value;
        }
      }
    }

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

    return {
      id: this.id,
      ...(refId ? { refId: String(refId) } : {}),
      type: String(type),
      ...(this.props?.isBoundary ? { isBoundary: true } : {}),
      props: props,
      children: children
    };
  }

  destroy() {
    this.clearCallbacks();
    this.container?.unregisterNode(this);
    for (const child of this.children) {
      child.destroy();
    }
  }
}
