import React, { ReactNode } from 'react';
import { WidgetProps } from './types';

export interface SwitchProps extends WidgetProps {
  value: boolean;
  onChanged?: (value: boolean) => void;
}

export class Switch extends React.Component<SwitchProps> {
  render(): ReactNode {
    return React.createElement('flutter-switch', { ...this.props });
  }
}

export default Switch;
