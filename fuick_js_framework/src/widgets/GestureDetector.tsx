import React, { ReactNode } from 'react';
import { WidgetProps } from './types';

export interface GestureDetectorProps extends WidgetProps {
  onTap?: () => void;
}

export class GestureDetector extends React.Component<GestureDetectorProps> {
  render(): ReactNode {
    return React.createElement('GestureDetector', { ...this.props });
  }
}

export default GestureDetector;
