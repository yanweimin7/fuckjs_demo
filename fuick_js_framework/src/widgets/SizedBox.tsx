import React, { ReactNode } from 'react';
import { WidgetProps } from './types';

export interface SizedBoxProps extends WidgetProps {
  width?: number;
  height?: number;
}

export class SizedBox extends React.Component<SizedBoxProps> {
  render(): ReactNode {
    return React.createElement('SizedBox', { ...this.props });
  }
}

export default SizedBox;
