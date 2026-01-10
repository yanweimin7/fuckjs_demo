import { registerWidget } from './registry';
import { WidgetProps } from './types';

export interface SingleChildScrollViewProps extends WidgetProps {
  scrollDirection?: 'horizontal' | 'vertical';
}

registerWidget({
  name: 'SingleChildScrollView',
  isBoundary: true,
});

export const SingleChildScrollView = 'SingleChildScrollView';
