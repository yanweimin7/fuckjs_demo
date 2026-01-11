import React, { ReactNode } from 'react';
import { WidgetProps } from './types';

export interface RowProps extends WidgetProps {
  mainAxisAlignment?: 'start' | 'end' | 'center' | 'spaceBetween' | 'spaceAround' | 'spaceEvenly';
  crossAxisAlignment?: 'start' | 'end' | 'center' | 'stretch';
  mainAxisSize?: 'min' | 'max';
}

export class Row extends React.Component<RowProps> {
  render(): ReactNode {
    return React.createElement('flutter-row', { ...this.props });
  }
}

export default Row;
