import React, { ReactNode } from 'react';
import { WidgetProps } from './types';

export class Center extends React.Component<WidgetProps> {
  render(): ReactNode {
    return React.createElement('flutter-center', { ...this.props, isBoundary: false });
  }
}

export default Center;
