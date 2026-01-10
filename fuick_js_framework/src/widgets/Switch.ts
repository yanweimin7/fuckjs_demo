import { registerWidget } from './registry';
import { WidgetProps } from './types';

export interface SwitchProps extends WidgetProps {
  value: boolean;
  onChanged?: (value: boolean) => void;
  onChangedJs?: { call: string; args?: any };
  onChangedEventId?: string;
}

registerWidget({
  name: 'Switch',
  isBoundary: true,
  events: ['onChanged'],
});

export const Switch = 'Switch';
