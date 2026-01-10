import React, { ReactNode } from 'react';
import { WidgetProps } from './types';

export interface StackProps extends WidgetProps {
  alignment?: string;
  fit?: 'loose' | 'expand' | 'passthrough';
}

export class Stack extends React.Component<StackProps> {
  render(): ReactNode {
    return React.createElement('flutter-stack', { ...this.props, isBoundary: true });
  }
}

export default Stack;
