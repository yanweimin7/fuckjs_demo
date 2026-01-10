import { registerWidget } from './registry';
import { WidgetProps } from './types';

export interface CircularProgressIndicatorProps extends WidgetProps {
  color?: string;
  strokeWidth?: number;
}

registerWidget({
  name: 'CircularProgressIndicator',
  isBoundary: false,
});

export const CircularProgressIndicator = 'CircularProgressIndicator';
