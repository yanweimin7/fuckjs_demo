import { registerWidget } from './registry';
import { BaseProps } from './types';

export interface FlexibleProps extends BaseProps {
  flex?: number;
  fit?: 'tight' | 'loose';
}

registerWidget({
  name: 'Flexible',
  isBoundary: false,
});

export const Flexible = 'Flexible';
