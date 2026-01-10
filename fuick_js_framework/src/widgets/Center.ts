import { registerWidget } from './registry';
import { BaseProps } from './types';

export interface CenterProps extends BaseProps { }

registerWidget({
  name: 'Center',
  isBoundary: false,
});

export const Center = 'Center';
