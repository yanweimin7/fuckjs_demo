import React, { ReactNode } from 'react';
import { WidgetProps } from './types';

export interface DividerProps extends WidgetProps {
  height?: number;
  thickness?: number;
  color?: string;
}

export class Divider extends React.Component<DividerProps> {
  render(): ReactNode {
    return React.createElement('Divider', { ...this.props, isBoundary: false });
  }
}

export default Divider;
