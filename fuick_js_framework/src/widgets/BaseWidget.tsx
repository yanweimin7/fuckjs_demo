import React from 'react';
import { PageContext } from '../PageContext';
import { refsId } from '../utils/ids';
import { WidgetProps } from './types';

export abstract class BaseWidget<P extends WidgetProps = WidgetProps, S = {}> extends React.Component<P, S> {
  static contextType = PageContext;
  private _internalRefId = refsId();

  public get rawRefId(): string {
    return this.props.refId || this.props.id?.toString() || (this.props as any).key?.toString() || this._internalRefId;
  }

  public get pageId(): number {
    return (this.context as any)?.pageId || 0;
  }

  public get scopedRefId(): string {
    const raw = this.rawRefId;
    // If it already contains ':', it's likely already scoped
    if (raw.indexOf(':') !== -1) {
      return raw;
    }
    return `${this.pageId}:${raw}`;
  }

  protected callNativeCommand(method: string, args: any = {}, nodeType?: string) {
    if (typeof (globalThis as any).dartCallNative === 'function') {
      (globalThis as any).dartCallNative('componentCommand', {
        pageId: this.pageId,
        refId: this.scopedRefId,
        method,
        args,
        nodeType: nodeType || (this.constructor as any).name
      });
    }
  }
}
