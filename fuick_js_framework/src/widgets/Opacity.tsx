import React, { ReactNode } from 'react';
import { BaseProps } from './types';

export interface OpacityProps extends BaseProps {
  opacity: number;
}

export class Opacity extends React.Component<OpacityProps> {
  render(): ReactNode {
    return React.createElement('Opacity', { ...this.props, isBoundary: false });
  }
}

export default Opacity;
