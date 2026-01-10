import { registerWidget } from './registry';
import { BaseProps } from './types';

export interface SizedBoxProps extends BaseProps {
  width?: number;
  height?: number;
}

registerWidget({
  name: 'SizedBox',
  isBoundary: false,
});

export const SizedBox = 'SizedBox';
