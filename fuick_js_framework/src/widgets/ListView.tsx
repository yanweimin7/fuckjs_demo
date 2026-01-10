import React, { ReactNode } from 'react';
import { WidgetProps } from './types';

export interface ListViewProps extends WidgetProps {
  scrollDirection?: 'horizontal' | 'vertical';
  shrinkWrap?: boolean;
}

export class ListView extends React.Component<ListViewProps> {
  render(): ReactNode {
    return React.createElement('flutter-list-view', { ...this.props, isBoundary: true });
  }
}

export default ListView;
