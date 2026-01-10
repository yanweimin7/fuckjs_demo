import React, { ReactNode } from 'react';
import { WidgetProps } from './types';

export interface TextFieldProps extends WidgetProps {
  hintText?: string;
  hint?: string;
  onChanged?: (value: string) => void;
  onSubmitted?: (value: string) => void;
}

export class TextField extends React.Component<TextFieldProps> {
  render(): ReactNode {
    return React.createElement('flutter-text-field', { ...this.props, isBoundary: true });
  }
}

export default TextField;
