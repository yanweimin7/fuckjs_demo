import { registerWidget } from './registry';
import { BaseProps } from './types';

export interface ExpandedProps extends BaseProps {
  flex?: number;
}

registerWidget({
  name: 'Expanded',
  isBoundary: false,
});

export const Expanded = 'Expanded';
