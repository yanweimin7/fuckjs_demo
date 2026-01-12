import React, { ReactNode } from 'react';
import { WidgetProps } from './types';
import { refsId } from '../utils/ids';

export interface PageViewProps extends WidgetProps {
  scrollDirection?: 'horizontal' | 'vertical';
  initialPage?: number;
  onPageChanged?: (index: number) => void;
}

export class PageView extends React.Component<PageViewProps> {
  private refId = refsId();

  public animateToPage(page: number, duration: number = 300, curve: string = 'easeInOut') {
    if (typeof (globalThis as any).dartCallNative === 'function') {
      (globalThis as any).dartCallNative('componentCommand', {
        refId: this.props.refId || this.refId,
        method: 'animateToPage',
        args: { page, duration, curve },
        nodeType: 'PageView'
      });
    }
  }

  public setPageIndex(index: number) {
    if (typeof (globalThis as any).dartCallNative === 'function') {
      (globalThis as any).dartCallNative('componentCommand', {
        refId: this.props.refId || this.refId,
        method: 'setPageIndex',
        args: { index },
        nodeType: 'PageView'
      });
    }
  }

  render(): ReactNode {
    return React.createElement('flutter-page-view', {
      ...this.props,
      refId: this.props.refId || this.refId,
      isBoundary: true
    });
  }
}

export default PageView;
