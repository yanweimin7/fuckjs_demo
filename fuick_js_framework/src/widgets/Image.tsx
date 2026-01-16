import React, { ReactNode } from 'react';
import { WidgetProps } from './types';

export interface ImageProps extends WidgetProps {
  url: string;
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'fitWidth' | 'fitHeight' | 'none' | 'scaleDown';
  borderRadius?: number | {
    topLeft?: number;
    topRight?: number;
    bottomLeft?: number;
    bottomRight?: number;
  };
}

export class Image extends React.Component<ImageProps> {
  render(): ReactNode {
    return React.createElement('Image', { ...this.props, isBoundary: false });
  }
}

export default Image;
