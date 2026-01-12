import React, { ReactNode } from 'react';
import { WidgetProps } from './types';
import { refsId } from '../utils/ids';

export interface ListViewProps extends WidgetProps {
  scrollDirection?: 'horizontal' | 'vertical';
  shrinkWrap?: boolean;
  itemCount?: number;
  itemBuilder?: (index: number) => ReactNode;
}

export class ListView extends React.Component<ListViewProps> {
  private _refId = refsId();

  public get refId() {
    return this.props.refId || this.props.id || this._refId;
  }

  public animateTo(offset: number, duration: number = 300, curve: string = 'easeInOut') {
    if (typeof (globalThis as any).dartCallNative === 'function') {
      (globalThis as any).dartCallNative('componentCommand', {
        refId: this.refId,
        method: 'animateTo',
        args: { offset, duration, curve },
        nodeType: 'ListView'
      });
    }
  }

  render(): ReactNode {
    const { children, ...rest } = this.props;

    return React.createElement('flutter-list-view', {
      ...rest,
      hasBuilder: !!this.props.itemBuilder,
      refId: this.refId,
      isBoundary: true
    }, children);
  }
}

export default ListView;
