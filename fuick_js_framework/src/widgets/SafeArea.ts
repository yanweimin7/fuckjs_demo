import { registerWidget } from './registry';
import { BaseProps } from './types';

export interface SafeAreaProps extends BaseProps {
}

registerWidget({
  name: 'SafeArea',
  isBoundary: false,
});

export const SafeArea = 'SafeArea';
