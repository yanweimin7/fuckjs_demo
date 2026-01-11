import React, { ReactNode } from 'react';
import { WidgetProps } from './types';
import { refsId } from '../utils/ids';

export interface TextFieldProps extends WidgetProps {
  hintText?: string;
  hint?: string;
  onChanged?: (value: string) => void;
  onSubmitted?: (value: string) => void;
}

export class TextField extends React.Component<TextFieldProps> {
  private refId = refsId();

  render(): ReactNode {
    return React.createElement('flutter-text-field', {
      ...this.props,
      refId: this.props.refId || this.refId
    });
  }
}

export default TextField;
