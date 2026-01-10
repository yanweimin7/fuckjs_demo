import { registerWidget } from './registry';
import { WidgetProps } from './types';

export interface StackProps extends WidgetProps {
  alignment?: 'center' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
}

registerWidget({
  name: 'Stack',
  isBoundary: true,
});

export const Stack = 'Stack';
