import React, { ReactNode } from 'react';
import { WidgetProps } from './types';

export interface PageViewProps extends WidgetProps {
  scrollDirection?: 'horizontal' | 'vertical';
  currentPage?: number;
  onPageChanged?: (index: number) => void;
  id?: number;
}

export class PageView extends React.Component<PageViewProps> {
  render(): ReactNode {
    return React.createElement('flutter-page-view', { ...this.props, isBoundary: true });
  }
}

export default PageView;
