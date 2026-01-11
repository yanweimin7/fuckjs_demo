import React, { ReactNode } from 'react';
import { WidgetProps } from './types';

export interface InkWellProps extends WidgetProps {
  onTap?: () => void;
}

export class InkWell extends React.Component<InkWellProps> {
  render(): ReactNode {
    return React.createElement('flutter-ink-well', { ...this.props });
  }
}

export default InkWell;
