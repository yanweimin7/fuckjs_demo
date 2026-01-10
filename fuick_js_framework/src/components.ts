import React from 'react';
import * as Widgets from './widgets';

// 导出内置组件名字符串，并关联类型定义
export const Column = Widgets.Column as unknown as React.FC<JSX.ColumnProps>;
export const Container = Widgets.Container as unknown as React.FC<JSX.ContainerProps>;
export const Text = Widgets.Text as unknown as React.FC<JSX.TextProps>;
export const ListView = Widgets.ListView as unknown as React.FC<JSX.ListViewProps>;
export const Padding = Widgets.Padding as unknown as React.FC<JSX.PaddingProps>;
export const Row = Widgets.Row as unknown as React.FC<JSX.RowProps>;
export const Image = Widgets.Image as unknown as React.FC<JSX.ImageProps>;
export const SizedBox = Widgets.SizedBox as unknown as React.FC<JSX.SizedBoxProps>;
export const Button = Widgets.Button as unknown as React.FC<JSX.ButtonProps>;
export const Center = Widgets.Center as unknown as React.FC<JSX.CenterProps>;
export const Icon = Widgets.Icon as unknown as React.FC<JSX.IconProps>;
export const TextField = Widgets.TextField as unknown as React.FC<JSX.TextFieldProps>;
export const Switch = Widgets.Switch as unknown as React.FC<JSX.SwitchProps>;
export const Expanded = Widgets.Expanded as unknown as React.FC<JSX.ExpandedProps>;
export const Flexible = Widgets.Flexible as unknown as React.FC<JSX.FlexibleProps>;
export const GestureDetector = Widgets.GestureDetector as unknown as React.FC<JSX.GestureDetectorProps>;
export const InkWell = Widgets.InkWell as unknown as React.FC<JSX.GestureDetectorProps>;
export const Divider = Widgets.Divider as unknown as React.FC<JSX.DividerProps>;
export const SingleChildScrollView = Widgets.SingleChildScrollView as unknown as React.FC<JSX.SingleChildScrollViewProps>;
export const Stack = Widgets.Stack as unknown as React.FC<JSX.StackProps>;
export const Positioned = Widgets.Positioned as unknown as React.FC<JSX.PositionedProps>;
export const Opacity = Widgets.Opacity as unknown as React.FC<JSX.OpacityProps>;
export const CircularProgressIndicator = Widgets.CircularProgressIndicator as unknown as React.FC<JSX.CircularProgressIndicatorProps>;
