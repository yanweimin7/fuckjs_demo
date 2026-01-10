import React, { ReactNode } from 'react';
import { WidgetProps } from './types';

export interface ExpandedProps extends WidgetProps {
  flex?: number;
}

export class Expanded extends React.Component<ExpandedProps> {
  render(): ReactNode {
    return React.createElement('flutter-expanded', { ...this.props, isBoundary: true });
  }
}

export default Expanded;
