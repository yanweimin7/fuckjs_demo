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
    __dispatchEvent: (id: string, payload: any) => void;
  }

  var FuickUIController: GlobalFramework;
  var queueMicrotask: (fn: () => void) => void;
  var __handleTimer: (id: number) => void;

  // Extend globalThis
  interface Object {
    FuickUIController: GlobalFramework;
    dartCallNative: (method: string, args: any) => any;
    dartCallNativeAsync: (method: string, args: any) => Promise<any>;
  }

  namespace JSX {
    interface IntrinsicElements {
      'flutter-text': import('./widgets/Text').TextProps;
      'flutter-column': import('./widgets/Column').ColumnProps;
      'flutter-row': import('./widgets/Row').RowProps;
      'flutter-container': import('./widgets/Container').ContainerProps;
      'flutter-button': import('./widgets/Button').ButtonProps;
      'flutter-text-field': import('./widgets/TextField').TextFieldProps;
      'flutter-switch': import('./widgets/Switch').SwitchProps;
      'flutter-sized-box': import('./widgets/SizedBox').SizedBoxProps;
      'flutter-image': import('./widgets/Image').ImageProps;
      'flutter-list-view': import('./widgets/ListView').ListViewProps;
      'flutter-padding': import('./widgets/Padding').PaddingProps;
      'flutter-stack': import('./widgets/Stack').StackProps;
      'flutter-positioned': import('./widgets/Positioned').PositionedProps;
      'flutter-icon': import('./widgets/Icon').IconProps;
      'flutter-opacity': import('./widgets/Opacity').OpacityProps;
      'flutter-center': import('./widgets/Center').CenterProps;
      'flutter-expanded': import('./widgets/Expanded').ExpandedProps;
      'flutter-flexible': import('./widgets/Flexible').FlexibleProps;
      'flutter-gesture-detector': import('./widgets/GestureDetector').GestureDetectorProps;
      'flutter-ink-well': import('./widgets/InkWell').InkWellProps;
      'flutter-divider': import('./widgets/Divider').DividerProps;
      'flutter-single-child-scroll-view': import('./widgets/SingleChildScrollView').SingleChildScrollViewProps;
      'flutter-circular-progress-indicator': import('./widgets/CircularProgressIndicator').CircularProgressIndicatorProps;
      'flutter-safe-area': import('./widgets/SafeArea').SafeAreaProps;
      'flutter-scaffold': import('./widgets/Scaffold').ScaffoldProps;
      'flutter-app-bar': import('./widgets/AppBar').AppBarProps;
      'FlutterProps': { propsKey: string; children?: any };
      'flutter-props': { propsKey: string; children?: any };
      'flutter-batched-list-view': any;
      [elemName: string]: any;
    }
  }
}

export { };
