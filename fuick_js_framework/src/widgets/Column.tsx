import React, { ReactNode } from 'react';
import { WidgetProps } from './types';

export interface ColumnProps extends WidgetProps {
  mainAxisAlignment?: 'start' | 'end' | 'center' | 'spaceBetween' | 'spaceAround' | 'spaceEvenly';
  crossAxisAlignment?: 'start' | 'end' | 'center' | 'stretch';
  mainAxisSize?: 'min' | 'max';
}

export class Column extends React.Component<ColumnProps> {
  render(): ReactNode {
    return React.createElement('flutter-column', { ...this.props });
  }
}

export default Column;
