import React, { ReactNode } from 'react';
import { BaseProps } from './types';

export interface PositionedProps extends BaseProps {
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
  width?: number;
  height?: number;
}

export class Positioned extends React.Component<PositionedProps> {
  render(): ReactNode {
    return React.createElement('flutter-positioned', { ...this.props, isBoundary: false });
  }
}

export default Positioned;
