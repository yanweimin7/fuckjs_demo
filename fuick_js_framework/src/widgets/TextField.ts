import { registerWidget } from './registry';
import { WidgetProps } from './types';

export interface TextFieldProps extends WidgetProps {
  hintText?: string;
  hint?: string;
  onChanged?: (value: string) => void;
  onChangedJs?: { call: string; args?: any };
  onChangedEventId?: string;
  onSubmitted?: (value: string) => void;
  onSubmittedJs?: { call: string; args?: any };
  onSubmittedEventId?: string;
}

registerWidget({
  name: 'TextField',
  isBoundary: true,
  events: ['onChanged', 'onSubmitted'],
});

export const TextField = 'TextField';
