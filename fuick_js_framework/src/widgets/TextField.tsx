import React, { ReactNode } from 'react';
import { WidgetProps } from './types';
import { BaseWidget } from './BaseWidget';

export interface TextFieldProps extends WidgetProps {
  hintText?: string;
  hint?: string;
  onChanged?: (value: string) => void;
  onSubmitted?: (value: string) => void;
}

export class TextField extends BaseWidget<TextFieldProps> {
  public setText(text: string) {
    this.callNativeCommand('setText', { text });
  }

  public clear() {
    this.callNativeCommand('clear', {});
  }

  render(): ReactNode {
    return React.createElement('TextField', {
      ...this.props,
      refId: this.scopedRefId,
      isBoundary: true
    });
  }
}

export default TextField;
