import { registerWidget } from './registry';
import { WidgetProps } from './types';

export interface GestureDetectorProps extends WidgetProps {
  onTap?: () => void;
  onTapJs?: { call: string; args?: any };
  onTapEventId?: string;
  onTapPayload?: any;
}

registerWidget({
  name: 'GestureDetector',
  isBoundary: true,
  events: ['onTap'],
});

export const GestureDetector = 'GestureDetector';
