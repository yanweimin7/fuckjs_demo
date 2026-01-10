import React, { ReactNode } from 'react';
import { WidgetProps } from './types';

export interface SingleChildScrollViewProps extends WidgetProps {
  scrollDirection?: 'horizontal' | 'vertical';
}

export class SingleChildScrollView extends React.Component<SingleChildScrollViewProps> {
  render(): ReactNode {
    return React.createElement('flutter-single-child-scroll-view', { ...this.props, isBoundary: true });
  }
}

export default SingleChildScrollView;
