import React, { ReactNode } from 'react';
import { BaseProps } from './types';
import { FlutterProps } from './FlutterProps';

export interface ScaffoldProps extends BaseProps {
  appBar?: any;
  body?: any;
  floatingActionButton?: any;
  drawer?: any;
  endDrawer?: any;
  bottomNavigationBar?: any;
  bottomSheet?: any;
  backgroundColor?: string;
}

export class Scaffold extends React.Component<ScaffoldProps> {
  render(): ReactNode {
    const { appBar, body, floatingActionButton, drawer, endDrawer, bottomNavigationBar, bottomSheet, children, ...otherProps } = this.props;
    return React.createElement(
      'Scaffold',
      { ...otherProps },
      appBar && React.createElement(FlutterProps, { propsKey: 'appBar' }, appBar),
      body && React.createElement(FlutterProps, { propsKey: 'body' }, body),
      floatingActionButton && React.createElement(FlutterProps, { propsKey: 'floatingActionButton' }, floatingActionButton),
      drawer && React.createElement(FlutterProps, { propsKey: 'drawer' }, drawer),
      endDrawer && React.createElement(FlutterProps, { propsKey: 'endDrawer' }, endDrawer),
      bottomNavigationBar && React.createElement(FlutterProps, { propsKey: 'bottomNavigationBar' }, bottomNavigationBar),
      bottomSheet && React.createElement(FlutterProps, { propsKey: 'bottomSheet' }, bottomSheet),
      children
    );
  }
}

export default Scaffold;
