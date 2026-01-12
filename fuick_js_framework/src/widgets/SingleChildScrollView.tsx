import React, { ReactNode } from 'react';
import { WidgetProps } from './types';
import { refsId } from '../utils/ids';

export interface SingleChildScrollViewProps extends WidgetProps {
  scrollDirection?: 'horizontal' | 'vertical';
}

export class SingleChildScrollView extends React.Component<SingleChildScrollViewProps> {
  private refId = refsId();

  render(): ReactNode {
    return React.createElement('flutter-single-child-scroll-view', {
      ...this.props,
      refId: this.props.refId || this.refId,
      isBoundary: true
    });
  }
}

export default SingleChildScrollView;
