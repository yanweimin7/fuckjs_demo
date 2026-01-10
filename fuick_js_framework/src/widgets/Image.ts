import { registerWidget } from './registry';
import { WidgetProps } from './types';

export interface ImageProps extends WidgetProps {
  url: string;
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'fitWidth' | 'fitHeight' | 'none' | 'scaleDown';
  borderRadius?: number | {
    topLeft?: number;
    topRight?: number;
    bottomLeft?: number;
    bottomRight?: number;
  };
}

registerWidget({
  name: 'Image',
  isBoundary: false,
});

export const Image = 'Image';
