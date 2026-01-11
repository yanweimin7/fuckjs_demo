import React, { ReactNode } from 'react';
import { WidgetProps } from './types';
import { refsId } from '../utils/ids';

export interface GridViewProps extends WidgetProps {
  crossAxisCount: number;
  mainAxisSpacing?: number;
  crossAxisSpacing?: number;
  childAspectRatio?: number;
  padding?: any;
}

export class GridView extends React.Component<GridViewProps> {
  private refId = refsId();

  render(): ReactNode {
    return React.createElement('flutter-grid-view', {
      ...this.props,
      refId: this.props.refId || this.refId
    });
  }
}

export default GridView;
