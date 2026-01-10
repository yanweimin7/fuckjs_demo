import React from 'react';

declare module 'react' {
  export = React;
}
declare module 'react-reconciler';

declare global {
  namespace React {
    interface ReactElement {
      type: any;
      props: any;
      key: any;
    }
  }

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
    interface EdgeInsets {
      left?: number;
      top?: number;
      right?: number;
      bottom?: number;
    }

    interface BoxDecoration {
      color?: string;
      borderRadius?: number | {
        topLeft?: number;
        topRight?: number;
        bottomLeft?: number;
        bottomRight?: number;
      };
    }

    interface BaseProps {
      key?: string | number;
      children?: any;
    }

    interface WidgetProps extends BaseProps {
      padding?: number | EdgeInsets;
      margin?: number | EdgeInsets;
    }

    interface ColumnProps extends WidgetProps {
      mainAxisAlignment?: 'start' | 'end' | 'center' | 'spaceBetween' | 'spaceAround' | 'spaceEvenly';
      crossAxisAlignment?: 'start' | 'end' | 'center' | 'stretch';
      mainAxisSize?: 'min' | 'max';
    }

    interface RowProps extends WidgetProps {
      mainAxisAlignment?: 'start' | 'end' | 'center' | 'spaceBetween' | 'spaceAround' | 'spaceEvenly';
      crossAxisAlignment?: 'start' | 'end' | 'center' | 'stretch';
      mainAxisSize?: 'min' | 'max';
    }

    interface ContainerProps extends WidgetProps {
      width?: number;
      height?: number;
      color?: string;
      alignment?: 'center' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
      decoration?: BoxDecoration;
      borderRadius?: number | {
        topLeft?: number;
        topRight?: number;
        bottomLeft?: number;
        bottomRight?: number;
      };
      border?: {
        color?: string;
        width?: number;
      };
    }

    interface TextProps extends WidgetProps {
      text: string;
      fontSize?: number;
      color?: string;
    }

    interface ImageProps extends WidgetProps {
      url: string;
      width?: number;
      height?: number;
      fit?: 'cover' | 'contain' | 'fill' | 'fitWidth' | 'fitHeight' | 'none' | 'scaleDown';
      borderRadius?: number | {
        topLeft?: number;
        topRight?: number;
        bottomLeft?: number;
        bottomRight?: number;
      };
    }

    interface SizedBoxProps extends BaseProps {
      width?: number;
      height?: number;
    }

    interface ButtonProps extends WidgetProps {
      text: string;
      onTap?: () => void;
      onTapJs?: { call: string; args?: any };
      onTapEventId?: string;
      onTapPayload?: any;
    }

    interface TextFieldProps extends WidgetProps {
      hint?: string;
      onChanged?: (value: string) => void;
      onChangedJs?: { call: string; args?: any };
      onChangedEventId?: string;
      onSubmitted?: (value: string) => void;
      onSubmittedJs?: { call: string; args?: any };
      onSubmittedEventId?: string;
    }

    interface SwitchProps extends WidgetProps {
      value: boolean;
      onChanged?: (value: boolean) => void;
      onChangedJs?: { call: string; args?: any };
      onChangedEventId?: string;
    }

    interface IconProps extends WidgetProps {
      codePoint: number;
      size?: number;
      color?: string;
    }

    interface ListViewProps extends WidgetProps {
      scrollDirection?: 'horizontal' | 'vertical';
      shrinkWrap?: boolean;
    }

    interface StackProps extends WidgetProps {
      alignment?: 'center' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
    }

    interface PositionedProps extends BaseProps {
      left?: number;
      top?: number;
      right?: number;
      bottom?: number;
      width?: number;
      height?: number;
    }

    interface OpacityProps extends BaseProps {
      opacity: number;
    }

    interface CenterProps extends BaseProps { }

    interface ExpandedProps extends BaseProps {
      flex?: number;
    }

    interface FlexibleProps extends BaseProps {
      flex?: number;
    }

    interface GestureDetectorProps extends BaseProps {
      onTap?: () => void;
      onTapJs?: { call: string; args?: any };
      onTapEventId?: string;
      onTapPayload?: any;
    }

    interface DividerProps extends BaseProps {
      height?: number;
      thickness?: number;
      color?: string;
      indent?: number;
      endIndent?: number;
    }

    interface SingleChildScrollViewProps extends BaseProps {
      padding?: number | EdgeInsets;
      scrollDirection?: 'horizontal' | 'vertical';
    }

    interface PaddingProps extends BaseProps {
      padding: number | EdgeInsets;
    }

    interface CircularProgressIndicatorProps extends BaseProps {
      color?: string;
      strokeWidth?: number;
      padding?: number | EdgeInsets;
    }

    interface IntrinsicElements {
      Column: ColumnProps;
      Row: RowProps;
      Text: TextProps;
      Image: ImageProps;
      Container: ContainerProps;
      Padding: PaddingProps;
      SizedBox: SizedBoxProps;
      Divider: DividerProps;
      Button: ButtonProps;
      ListView: ListViewProps;
      SingleChildScrollView: SingleChildScrollViewProps;
      Center: CenterProps;
      Expanded: ExpandedProps;
      Flexible: FlexibleProps;
      Icon: IconProps;
      TextField: TextFieldProps;
      Switch: SwitchProps;
      CircularProgressIndicator: CircularProgressIndicatorProps;
      GestureDetector: GestureDetectorProps;
      InkWell: GestureDetectorProps;
      Stack: StackProps;
      Positioned: PositionedProps;
      Opacity: OpacityProps;
      SafeArea: { children?: any; key?: any };
      Scaffold: { appBar?: any; body?: any; backgroundColor?: string; key?: any };
      AppBar: { title?: any; backgroundColor?: string; key?: any };
      [elemName: string]: any;
    }
  }
}

export { };
