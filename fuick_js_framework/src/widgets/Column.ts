import { registerWidget } from './registry';
import { WidgetProps } from './types';

export interface ColumnProps extends WidgetProps {
  mainAxisAlignment?: 'start' | 'end' | 'center' | 'spaceBetween' | 'spaceAround' | 'spaceEvenly';
  crossAxisAlignment?: 'start' | 'end' | 'center' | 'stretch';
  mainAxisSize?: 'min' | 'max';
}

registerWidget({
  name: 'Column',
  isBoundary: true,
});

export const Column = 'Column';
