import { registerWidget } from './registry';
import { WidgetProps } from './types';

export interface IconProps extends WidgetProps {
  codePoint: number;
  size?: number;
  color?: string;
}

registerWidget({
  name: 'Icon',
  isBoundary: false,
});

export const Icon = 'Icon';
