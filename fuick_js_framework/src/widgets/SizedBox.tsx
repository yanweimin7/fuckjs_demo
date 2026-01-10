import React, { ReactNode } from 'react';
import { WidgetProps } from './types';

export interface SizedBoxProps extends WidgetProps {
  width?: number;
  height?: number;
}

export class SizedBox extends React.Component<SizedBoxProps> {
  render(): ReactNode {
    return React.createElement('flutter-sized-box', { ...this.props, isBoundary: true });
  }
}

export default SizedBox;
