import React, { ReactNode } from 'react';
import { WidgetProps } from './types';
import { refsId } from '../utils/ids';

export interface GridViewProps extends WidgetProps {
  crossAxisCount: number;
  mainAxisSpacing?: number;
  crossAxisSpacing?: number;
  childAspectRatio?: number;
  padding?: any;
  itemCount?: number;
  itemBuilder?: (index: number) => ReactNode;
  shrinkWrap?: boolean;
}

export const GridView: React.FC<GridViewProps> = (props) => {
  const refId = React.useMemo(() => props.refId || refsId(), [props.refId]);

  const { children, ...rest } = props;
  return React.createElement('flutter-grid-view', {
    ...rest,
    hasBuilder: !!props.itemBuilder,
    refId: refId,
    isBoundary: true
  }, children);
};

export default GridView;
