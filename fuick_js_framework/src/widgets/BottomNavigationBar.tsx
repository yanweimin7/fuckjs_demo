import React, { ReactNode } from 'react';
import { BaseProps } from './types';
import { FlutterProps } from './FlutterProps';

export interface BottomNavigationBarItemProps {
  icon: any;
  label?: string;
  activeIcon?: any;
  backgroundColor?: string;
  tooltip?: string;
}

export class BottomNavigationBarItem extends React.Component<BottomNavigationBarItemProps> {
  render(): ReactNode {
    const { icon, activeIcon, ...otherProps } = this.props;
    return React.createElement(
      'BottomNavigationBarItem',
      { ...otherProps },
      icon && React.createElement(FlutterProps, { propsKey: 'icon' }, icon),
      activeIcon && React.createElement(FlutterProps, { propsKey: 'activeIcon' }, activeIcon)
    );
  }
}

export interface BottomNavigationBarProps extends BaseProps {
  items: ReactNode[];
  onTap?: (index: number) => void;
  currentIndex?: number;
  elevation?: number;
  type?: any;
  fixedColor?: string;
  backgroundColor?: string;
  iconSize?: number;
  selectedItemColor?: string;
  unselectedItemColor?: string;
  selectedIconTheme?: any;
  unselectedIconTheme?: any;
  selectedFontSize?: number;
  unselectedFontSize?: number;
  selectedLabelStyle?: any;
  unselectedLabelStyle?: any;
  showSelectedLabels?: boolean;
  showUnselectedLabels?: boolean;
  mouseCursor?: any;
  enableFeedback?: boolean;
  landscapeLayout?: any;
  useLegacyColorScheme?: boolean;
}

export class BottomNavigationBar extends React.Component<BottomNavigationBarProps> {
  render(): ReactNode {
    const { items, children, ...otherProps } = this.props;
    return React.createElement(
      'BottomNavigationBar',
      { ...otherProps },
      items && items.map((item, index) => 
        React.createElement(FlutterProps, { key: `item-${index}`, propsKey: 'items' }, item)
      ),
      children
    );
  }
}

export default BottomNavigationBar;
