import React, { ReactNode } from 'react';
import { WidgetProps } from './types';

export interface IconProps extends WidgetProps {
  name: string;
  size?: number;
  color?: string;
}

export class Icon extends React.Component<IconProps> {
  render(): ReactNode {
    return React.createElement('Icon', { ...this.props, isBoundary: false });
  }
}

export default Icon;
