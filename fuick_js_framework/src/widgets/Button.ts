import { registerWidget } from './registry';
import { WidgetProps } from './types';

export interface ButtonProps extends WidgetProps {
  text: string;
  onTap?: () => void;
  onTapJs?: { call: string; args?: any };
  onTapEventId?: string;
  onTapPayload?: any;
}

registerWidget({
  name: 'Button',
  isBoundary: true,
  events: ['onTap'],
});

export const Button = 'Button';
