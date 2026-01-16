import React, { ReactNode } from 'react';
import { WidgetProps } from './types';

export interface TextProps extends WidgetProps {
  text: string;
  fontSize?: number;
  color?: string;
  fontWeight?: 'normal' | 'bold' | 'w100' | 'w200' | 'w300' | 'w400' | 'w500' | 'w600' | 'w700' | 'w800' | 'w900';
  textAlign?: 'left' | 'right' | 'center' | 'justify' | 'start' | 'end';
  maxLines?: number;
  overflow?: 'clip' | 'fade' | 'ellipsis' | 'visible';
}

export class Text extends React.Component<TextProps> {
  render(): ReactNode {
    return React.createElement('Text', { ...this.props, isBoundary: false });
  }
}

export default Text;
