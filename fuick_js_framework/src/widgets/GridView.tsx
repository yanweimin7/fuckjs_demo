import React, { ReactNode } from 'react';
import { WidgetProps } from './types';
import { BaseWidget } from './BaseWidget';
import { elementToDsl } from '../page_render';

export interface GridViewProps extends WidgetProps {
  crossAxisCount: number;
  mainAxisSpacing?: number;
  crossAxisSpacing?: number;
  childAspectRatio?: number;
  padding?: any;
  itemCount?: number;
  itemBuilder?: (index: number) => ReactNode;
  shrinkWrap?: boolean;
  cacheKey?: any;
}

export class GridView extends BaseWidget<GridViewProps> {
  public animateTo(offset: number, duration: number = 300, curve: string = 'easeInOut') {
    this.callNativeCommand('animateTo', { offset, duration, curve });
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

    return React.createElement('flutter-grid-view', {
      ...rest,
      hasBuilder: !!this.props.itemBuilder,
      refId: this.scopedRefId,
      isBoundary: true
    }, children);
  }
}

export default GridView;
