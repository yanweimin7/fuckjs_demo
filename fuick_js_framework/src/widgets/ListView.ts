import { registerWidget } from './registry';
import { WidgetProps } from './types';

export interface ListViewProps extends WidgetProps {
  scrollDirection?: 'horizontal' | 'vertical';
  shrinkWrap?: boolean;
}

registerWidget({
  name: 'ListView',
  isBoundary: true,
});

export const ListView = 'ListView';
