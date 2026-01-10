import React from 'react';

declare module 'react-reconciler';

declare global {

  // Bridge function to call Flutter
  function dartCallNative(method: string, args: any): any;
  function dartCallNativeAsync(method: string, args: any): Promise<any>;

  // Global polyfills and managers
  interface GlobalFramework {
    render: (pageId: number, path: string, params: any) => void;
    destroy: (pageId: number) => void;
  }

  var FuickUIController: GlobalFramework;
  var queueMicrotask: (fn: () => void) => void;
  var __handleTimer: (id: number) => void;
  var __dispatchEvent: (id: string, payload: any) => void;

  // Extend globalThis
  interface Object {
    FuickUIController: GlobalFramework;
    __dispatchEvent: (id: string, payload: any) => void;
    dartCallNative: (method: string, args: any) => any;
    dartCallNativeAsync: (method: string, args: any) => Promise<any>;
  }

  namespace JSX {
    type TextProps = import('./widgets/Text').TextProps;
    type ColumnProps = import('./widgets/Column').ColumnProps;
    type RowProps = import('./widgets/Row').RowProps;
    type ContainerProps = import('./widgets/Container').ContainerProps;
    type ButtonProps = import('./widgets/Button').ButtonProps;
    type TextFieldProps = import('./widgets/TextField').TextFieldProps;
    type SwitchProps = import('./widgets/Switch').SwitchProps;
    type SizedBoxProps = import('./widgets/SizedBox').SizedBoxProps;
    type ImageProps = import('./widgets/Image').ImageProps;
    type ListViewProps = import('./widgets/ListView').ListViewProps;
    type PaddingProps = import('./widgets/Padding').PaddingProps;
    type StackProps = import('./widgets/Stack').StackProps;
    type PositionedProps = import('./widgets/Positioned').PositionedProps;
    type IconProps = import('./widgets/Icon').IconProps;
    type OpacityProps = import('./widgets/Opacity').OpacityProps;
    type CenterProps = import('./widgets/Center').CenterProps;
    type ExpandedProps = import('./widgets/Expanded').ExpandedProps;
    type FlexibleProps = import('./widgets/Flexible').FlexibleProps;
    type GestureDetectorProps = import('./widgets/GestureDetector').GestureDetectorProps;
    type DividerProps = import('./widgets/Divider').DividerProps;
    type SingleChildScrollViewProps = import('./widgets/SingleChildScrollView').SingleChildScrollViewProps;
    type CircularProgressIndicatorProps = import('./widgets/CircularProgressIndicator').CircularProgressIndicatorProps;
    type SafeAreaProps = import('./widgets/SafeArea').SafeAreaProps;
    type ScaffoldProps = import('./widgets/Scaffold').ScaffoldProps;
    type AppBarProps = import('./widgets/AppBar').AppBarProps;

    interface IntrinsicElements {
      Text: TextProps;
      Column: ColumnProps;
      Row: RowProps;
      Container: ContainerProps;
      Button: ButtonProps;
      TextField: TextFieldProps;
      Switch: SwitchProps;
      SizedBox: SizedBoxProps;
      Image: ImageProps;
      ListView: ListViewProps;
      Padding: PaddingProps;
      Stack: StackProps;
      Positioned: PositionedProps;
      Icon: IconProps;
      Opacity: OpacityProps;
      Center: CenterProps;
      Expanded: ExpandedProps;
      Flexible: FlexibleProps;
      GestureDetector: GestureDetectorProps;
      InkWell: InkWellProps;
      Divider: DividerProps;
      SingleChildScrollView: SingleChildScrollViewProps;
      CircularProgressIndicator: CircularProgressIndicatorProps;
      SafeArea: SafeAreaProps;
      Scaffold: ScaffoldProps;
      AppBar: AppBarProps;
      [elemName: string]: any;
    }
  }
}

export { };
