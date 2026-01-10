import { registerWidget } from './registry';
import { BaseProps } from './types';

export interface DividerProps extends BaseProps {
  height?: number;
  thickness?: number;
  color?: string;
  indent?: number;
  endIndent?: number;
}

registerWidget({
  name: 'Divider',
  isBoundary: false,
});

export const Divider = 'Divider';
