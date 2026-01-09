import React from 'react';

// 导出内置组件名字符串，并关联类型定义
export const Column = 'Column' as unknown as React.FC<JSX.ColumnProps>;
export const Container = 'Container' as unknown as React.FC<JSX.ContainerProps>;
export const Text = 'Text' as unknown as React.FC<JSX.TextProps>;
export const ListView = 'ListView' as unknown as React.FC<JSX.ListViewProps>;
export const Padding = 'Padding' as unknown as React.FC<{ padding: JSX.EdgeInsets | number; children?: any }>;
export const Row = 'Row' as unknown as React.FC<JSX.RowProps>;
export const Image = 'Image' as unknown as React.FC<JSX.ImageProps>;
export const SizedBox = 'SizedBox' as unknown as React.FC<JSX.SizedBoxProps>;
export const Button = 'Button' as unknown as React.FC<JSX.ButtonProps>;
export const Center = 'Center' as unknown as React.FC<JSX.CenterProps>;
export const Icon = 'Icon' as unknown as React.FC<JSX.IconProps>;
export const TextField = 'TextField' as unknown as React.FC<JSX.TextFieldProps>;
export const Switch = 'Switch' as unknown as React.FC<JSX.SwitchProps>;
export const Expanded = 'Expanded' as unknown as React.FC<JSX.ExpandedProps>;
export const Flexible = 'Flexible' as unknown as React.FC<JSX.FlexibleProps>;
export const GestureDetector = 'GestureDetector' as unknown as React.FC<JSX.GestureDetectorProps>;
export const InkWell = 'InkWell' as unknown as React.FC<JSX.GestureDetectorProps>;
export const Divider = 'Divider' as unknown as React.FC<JSX.DividerProps>;
export const SingleChildScrollView = 'SingleChildScrollView' as unknown as React.FC<JSX.SingleChildScrollViewProps>;
export const Stack = 'Stack' as unknown as React.FC<JSX.StackProps>;
export const Positioned = 'Positioned' as unknown as React.FC<JSX.PositionedProps>;
export const Opacity = 'Opacity' as unknown as React.FC<JSX.OpacityProps>;
export const CircularProgressIndicator = 'CircularProgressIndicator' as unknown as React.FC<{ color?: string; strokeWidth?: number; padding?: number | JSX.EdgeInsets }>;

