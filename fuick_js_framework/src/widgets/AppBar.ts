import { registerWidget } from './registry';
import { BaseProps } from './types';

export interface AppBarProps extends BaseProps {
  title?: any;
  backgroundColor?: string;
}

registerWidget({
  name: 'AppBar',
  isBoundary: false,
});

export const AppBar = 'AppBar';
