import React, { ReactNode } from 'react';
import { WidgetProps } from './types';
import { refsId } from '../utils/ids';

export interface PageViewProps extends WidgetProps {
  scrollDirection?: 'horizontal' | 'vertical';
  currentPage?: number;
  onPageChanged?: (index: number) => void;
}

export class PageView extends React.Component<PageViewProps> {
  private refId = refsId();

  render(): ReactNode {
    return React.createElement('flutter-page-view', {
      ...this.props,
      refId: this.props.refId || this.refId
    });
  }
}

export default PageView;
