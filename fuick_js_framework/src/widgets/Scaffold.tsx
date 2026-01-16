import React, { ReactNode } from 'react';
import { BaseProps } from './types';
import { FlutterProps } from './FlutterProps';

export interface ScaffoldProps extends BaseProps {
  appBar?: any;
  body?: any;
  floatingActionButton?: any;
  backgroundColor?: string;
}

export class Scaffold extends React.Component<ScaffoldProps> {
  render(): ReactNode {
    const { appBar, body, floatingActionButton, children, ...otherProps } = this.props;
    return React.createElement(
      'Scaffold',
      { ...otherProps },
      appBar && React.createElement(FlutterProps, { propsKey: 'appBar' }, appBar),
      body && React.createElement(FlutterProps, { propsKey: 'body' }, body),
      floatingActionButton && React.createElement(FlutterProps, { propsKey: 'floatingActionButton' }, floatingActionButton),
      children
    );
  }
}

export default Scaffold;
