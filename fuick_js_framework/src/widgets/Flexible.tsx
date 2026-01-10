import React, { ReactNode } from 'react';
import { WidgetProps } from './types';

export interface FlexibleProps extends WidgetProps {
  flex?: number;
  fit?: 'tight' | 'loose';
}

export class Flexible extends React.Component<FlexibleProps> {
  render(): ReactNode {
    return React.createElement('flutter-flexible', { ...this.props, isBoundary: true });
  }
}

export default Flexible;
