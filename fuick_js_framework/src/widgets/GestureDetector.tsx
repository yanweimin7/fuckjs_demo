import React, { ReactNode } from 'react';
import { WidgetProps } from './types';

export interface GestureDetectorProps extends WidgetProps {
  onTap?: () => void;
}

export class GestureDetector extends React.Component<GestureDetectorProps> {
  render(): ReactNode {
    return React.createElement('flutter-gesture-detector', { ...this.props, isBoundary: true });
  }
}

export default GestureDetector;
