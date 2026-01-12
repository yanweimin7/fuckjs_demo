import React, { ReactNode } from 'react';
import { WidgetProps } from './types';
import { refsId } from '../utils/ids';

export interface GridViewProps extends WidgetProps {
  crossAxisCount: number;
  mainAxisSpacing?: number;
  crossAxisSpacing?: number;
  childAspectRatio?: number;
  padding?: any;
  itemCount?: number;
  itemBuilder?: (index: number) => ReactNode;
  shrinkWrap?: boolean;
}

export class GridView extends React.Component<GridViewProps> {
  private _refId = refsId();

  public get refId() {
    return this.props.refId || this._refId;
  }

  public animateTo(offset: number, duration: number = 300, curve: string = 'easeInOut') {
    if (typeof (globalThis as any).dartCallNative === 'function') {
      (globalThis as any).dartCallNative('componentCommand', {
        refId: this.refId,
        method: 'animateTo',
        args: { offset, duration, curve },
        nodeType: 'GridView'
      });
    }
  }

  render(): ReactNode {
    const { children, ...rest } = this.props;
    return React.createElement('flutter-grid-view', {
      ...rest,
      hasBuilder: !!this.props.itemBuilder,
      refId: this.refId,
      isBoundary: true
    }, children);
  }
}

export default GridView;
