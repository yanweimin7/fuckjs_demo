import { registerWidget } from './registry';
import { WidgetProps } from './types';

export interface InkWellProps extends WidgetProps {
  onTap?: () => void;
  onTapJs?: { call: string; args?: any };
  onTapEventId?: string;
  onTapPayload?: any;
}

registerWidget({
  name: 'InkWell',
  isBoundary: true,
  events: ['onTap'],
});

export const InkWell = 'InkWell';
