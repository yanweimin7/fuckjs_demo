import React, { ReactNode } from 'react';
import { WidgetProps } from './types';

export interface CircularProgressIndicatorProps extends WidgetProps {
  color?: string;
  strokeWidth?: number;
}

export class CircularProgressIndicator extends React.Component<CircularProgressIndicatorProps> {
  render(): ReactNode {
    return React.createElement('CircularProgressIndicator', { ...this.props, isBoundary: false });
  }
}

export default CircularProgressIndicator;
