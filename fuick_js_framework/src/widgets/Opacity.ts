import { registerWidget } from './registry';
import { BaseProps } from './types';

export interface OpacityProps extends BaseProps {
  opacity: number;
}

registerWidget({
  name: 'Opacity',
  isBoundary: false,
});

export const Opacity = 'Opacity';
