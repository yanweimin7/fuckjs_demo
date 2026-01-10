import { registerWidget } from './registry';
import { BaseProps } from './types';

export interface PositionedProps extends BaseProps {
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
  width?: number;
  height?: number;
}

registerWidget({
  name: 'Positioned',
  isBoundary: false,
});

export const Positioned = 'Positioned';
