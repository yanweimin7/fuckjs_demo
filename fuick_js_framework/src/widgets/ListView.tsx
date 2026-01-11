import React, { ReactNode } from 'react';
import { WidgetProps } from './types';
import { refsId } from '../utils/ids';

export interface ListViewProps extends WidgetProps {
  scrollDirection?: 'horizontal' | 'vertical';
  shrinkWrap?: boolean;
}

export class ListView extends React.Component<ListViewProps> {
  private refId = refsId();

  render(): ReactNode {
    return React.createElement('flutter-list-view', {
      ...this.props,
      refId: this.props.refId || this.refId
    });
  }
}

export default ListView;
