import React, { ReactNode } from 'react';
import { WidgetProps } from './types';
import { refsId } from '../utils/ids';

export interface ListViewProps extends WidgetProps {
  scrollDirection?: 'horizontal' | 'vertical';
  shrinkWrap?: boolean;
  itemCount?: number;
  itemBuilder?: (index: number) => ReactNode;
}

export const ListView: React.FC<ListViewProps> = (props) => {
  const refId = React.useMemo(() => props.refId || refsId(), [props.refId]);

  const { children, ...rest } = props;

  return React.createElement('flutter-list-view', {
    ...rest,
    hasBuilder: !!props.itemBuilder,
    refId: refId,
    isBoundary: true
  }, children);
};

export default ListView;
