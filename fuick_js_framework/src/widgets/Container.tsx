import React, { ReactNode } from 'react';
import { WidgetProps, BoxDecoration } from './types';

export interface ContainerProps extends WidgetProps {
  width?: number;
  height?: number;
  color?: string;
  alignment?: 'center' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  decoration?: BoxDecoration;
  borderRadius?: number | {
    topLeft?: number;
    topRight?: number;
    bottomLeft?: number;
    bottomRight?: number;
  };
  border?: {
    color?: string;
    width?: number;
  };
}

export class Container extends React.Component<ContainerProps> {
  render(): ReactNode {
    return React.createElement('flutter-container', { ...this.props, isBoundary: true });
  }
}

export default Container;
