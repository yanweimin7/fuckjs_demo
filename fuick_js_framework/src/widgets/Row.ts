import { registerWidget } from './registry';

export interface RowProps {
  mainAxisAlignment?: 'start' | 'end' | 'center' | 'spaceBetween' | 'spaceAround' | 'spaceEvenly';
  crossAxisAlignment?: 'start' | 'end' | 'center' | 'stretch';
  mainAxisSize?: 'min' | 'max';
  children?: any;
}

registerWidget({
  name: 'Row',
  isBoundary: true,
});

export const Row = 'Row';
