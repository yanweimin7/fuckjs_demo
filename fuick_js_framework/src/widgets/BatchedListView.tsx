import React, { ReactNode } from 'react';
import { WidgetProps } from './types';
import { BaseWidget } from './BaseWidget';

export interface BatchedListViewProps extends WidgetProps {
  scrollDirection?: 'horizontal' | 'vertical';
  orientation?: 'horizontal' | 'vertical';
  shrinkWrap?: boolean;
  padding?: any;
}

export class BatchedListView extends BaseWidget<BatchedListViewProps> {
  public animateTo(offset: number, duration: number = 300, curve: string = 'easeInOut') {
    this.callNativeCommand('animateTo', { offset, duration, curve });
  }

  public jumpTo(offset: number) {
    this.callNativeCommand('jumpTo', { offset });
  }

  render(): ReactNode {
    return React.createElement('BatchedListView', {
      ...this.props,
      refId: this.scopedRefId,
      isBoundary: true
    });
  }
}

export default BatchedListView;
