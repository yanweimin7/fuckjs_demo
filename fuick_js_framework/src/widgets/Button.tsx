import React, { ReactNode } from 'react';
import { WidgetProps } from './types';
import { refsId } from '../utils/ids';

export interface ButtonProps extends WidgetProps {
  text?: string;
  onTap?: () => void;
}

export class Button extends React.Component<ButtonProps> {
  private controllerId = refsId();

  render(): ReactNode {
    return React.createElement('flutter-button', {
      ...this.props,
      refId: this.props.refId || this.controllerId,
      isBoundary: true
    });
  }
}

export default Button;
