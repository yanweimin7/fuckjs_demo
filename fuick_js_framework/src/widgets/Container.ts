import { registerWidget } from './registry';
import { WidgetProps, BoxDecoration } from './types';

export interface ContainerProps extends WidgetProps {
  width?: number;
  height?: number;
  color?: string;
  alignment?: 'center' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  decoration?: BoxDecoration;
  borderRadius?: number | {
    topLeft?: number;
    topRight?: number;
    bottomLeft?: number;
    bottomRight?: number;
  };
  border?: {
    color?: string;
    width?: number;
  };
}

registerWidget({
  name: 'Container',
  isBoundary: true,
});

export const Container = 'Container';
