import { registerWidget } from './registry';
import { WidgetProps } from './types';

export interface PaddingProps extends WidgetProps {
}

registerWidget({
  name: 'Padding',
  isBoundary: false,
});

export const Padding = 'Padding';
