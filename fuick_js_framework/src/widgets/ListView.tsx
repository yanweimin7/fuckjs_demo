import React, { ReactNode } from 'react';
import { WidgetProps } from './types';
import { BaseWidget } from './BaseWidget';
import { elementToDsl } from '../page_render';

export interface ListViewProps extends WidgetProps {
  scrollDirection?: 'horizontal' | 'vertical';
  orientation?: 'horizontal' | 'vertical';
  shrinkWrap?: boolean;
  itemCount?: number;
  itemBuilder?: (index: number) => ReactNode;
  cacheKey?: any;
}

export class ListView extends BaseWidget<ListViewProps> {
  public animateTo(offset: number, duration: number = 300, curve: string = 'easeInOut') {
    this.callNativeCommand('animateTo', { offset, duration, curve });
  }

  public jumpTo(offset: number) {
    this.callNativeCommand('jumpTo', { offset });
  }

  public updateItem(index: number, dsl: any) {
    let finalDsl = dsl;
    if (React.isValidElement(dsl)) {
      finalDsl = elementToDsl(this.pageId, dsl);
    }

    this.callNativeCommand('updateItem', { index, dsl: finalDsl });
  }

  public refresh() {
    this.callNativeCommand('refresh');
  }

  render(): ReactNode {
    const { children, ...rest } = this.props;

    return React.createElement('flutter-list-view', {
      ...rest,
      hasBuilder: !!this.props.itemBuilder,
      refId: this.scopedRefId,
      isBoundary: true
    }, children);
  }
}

export default ListView;
