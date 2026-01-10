import React, { ReactNode } from 'react';
import { WidgetProps } from './types';

export interface PaddingProps extends WidgetProps {
  padding: any;
}

export class Padding extends React.Component<PaddingProps> {
  render(): ReactNode {
    return React.createElement('flutter-padding', { ...this.props, isBoundary: true });
  }
}

export default Padding;
