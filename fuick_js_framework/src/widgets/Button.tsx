import React, { ReactNode } from 'react';
import { WidgetProps } from './types';

export interface ButtonProps extends WidgetProps {
  text?: string;
  onTap?: () => void;
}

export class Button extends React.Component<ButtonProps> {
  render(): ReactNode {
    return React.createElement('Button', {
      ...this.props
    });
  }
}

export default Button;
