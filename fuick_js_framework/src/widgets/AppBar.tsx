import React, { ReactNode } from 'react';
import { BaseProps } from './types';
import { FlutterProps } from './FlutterProps';

export interface AppBarProps extends BaseProps {
  title?: any;
  leading?: any;
  actions?: any[];
  backgroundColor?: string;
  foregroundColor?: string;
  elevation?: number;
}

export class AppBar extends React.Component<AppBarProps> {
  render(): ReactNode {
    const { title, leading, actions, children, ...otherProps } = this.props;
    return React.createElement(
      'AppBar',
      { ...otherProps, isBoundary: false },
      title && React.createElement(FlutterProps, { propsKey: 'title' }, title),
      leading && React.createElement(FlutterProps, { propsKey: 'leading' }, leading),
      actions && actions.map((action, index) =>
        React.createElement(FlutterProps, { key: `action-${index}`, propsKey: 'actions' }, action)
      ),
      children
    );
  }
}

export default AppBar;
