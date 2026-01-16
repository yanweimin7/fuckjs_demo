import React, { ReactNode } from 'react';
import { BaseProps } from './types';
import { FlutterProps } from './FlutterProps';

export interface ListTileProps extends BaseProps {
  leading?: any;
  title?: any;
  subtitle?: any;
  trailing?: any;
  isThreeLine?: boolean;
  dense?: boolean;
  visualDensity?: any;
  shape?: any;
  contentPadding?: any;
  enabled?: boolean;
  onTap?: () => void;
  onLongPress?: () => void;
  selected?: boolean;
  focusColor?: string;
  hoverColor?: string;
  tileColor?: string;
  selectedTileColor?: string;
}

export class ListTile extends React.Component<ListTileProps> {
  render(): ReactNode {
    const { leading, title, subtitle, trailing, children, ...otherProps } = this.props;
    
    return React.createElement(
      'ListTile',
      { ...otherProps },
      leading && React.createElement(FlutterProps, { propsKey: 'leading' }, leading),
      title && React.createElement(FlutterProps, { propsKey: 'title' }, title),
      subtitle && React.createElement(FlutterProps, { propsKey: 'subtitle' }, subtitle),
      trailing && React.createElement(FlutterProps, { propsKey: 'trailing' }, trailing),
      children
    );
  }
}

export default ListTile;
