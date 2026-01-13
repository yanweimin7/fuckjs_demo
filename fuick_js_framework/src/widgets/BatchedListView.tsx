import React, { ReactNode } from 'react';
import { WidgetProps } from './types';
import { BaseWidget } from './BaseWidget';
import { elementToDsl } from '../page_render';

export interface BatchedListViewProps extends WidgetProps {
  scrollDirection?: 'horizontal' | 'vertical';
  orientation?: 'horizontal' | 'vertical';
  shrinkWrap?: boolean;
  itemCount: number;
  itemBuilder: (index: number) => ReactNode;
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
    const { itemCount, itemBuilder, children, ...rest } = this.props;

    // 预先生成所有 item 的 DSL
    const items: any[] = [];
    for (let i = 0; i < itemCount; i++) {
      const element = itemBuilder(i);
      items.push(elementToDsl(this.pageId, element));
    }

    return React.createElement('flutter-batched-list-view', {
      ...rest,
      items,
      refId: this.scopedRefId,
      isBoundary: true
    });
  }
}

export default BatchedListView;
