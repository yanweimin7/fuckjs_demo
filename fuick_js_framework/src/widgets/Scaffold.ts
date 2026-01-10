import { registerWidget } from './registry';
import { BaseProps } from './types';

export interface ScaffoldProps extends BaseProps {
  appBar?: any;
  body?: any;
  backgroundColor?: string;
}

registerWidget({
  name: 'Scaffold',
  isBoundary: true,
});

export const Scaffold = 'Scaffold';
