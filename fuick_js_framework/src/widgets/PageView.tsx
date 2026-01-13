import React, { ReactNode } from 'react';
import { WidgetProps } from './types';
import { BaseWidget } from './BaseWidget';

export interface PageViewProps extends WidgetProps {
  scrollDirection?: 'horizontal' | 'vertical';
  initialPage?: number;
  onPageChanged?: (index: number) => void;
}

export class PageView extends BaseWidget<PageViewProps> {
  public animateToPage(page: number, duration: number = 300, curve: string = 'easeInOut') {
    this.callNativeCommand('animateToPage', { page, duration, curve });
  }

  public jumpToPage(page: number) {
    this.callNativeCommand('jumpToPage', { page });
  }

  render(): ReactNode {
    const { ref, ...otherProps } = this.props as any;
    return React.createElement('flutter-page-view', {
      ...otherProps,
      refId: this.scopedRefId,
      isBoundary: true
    });
  }
}

export default PageView;
