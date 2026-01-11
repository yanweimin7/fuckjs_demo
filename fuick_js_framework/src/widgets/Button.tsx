import React, { ReactNode } from 'react';
import { WidgetProps } from './types';

export interface ButtonProps extends WidgetProps {
  text?: string;
  onTap?: () => void;
}

export class Button extends React.Component<ButtonProps> {
  render(): ReactNode {
    return React.createElement('flutter-button', {
      ...this.props
    });
  }
}

export default Button;
