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
  var ReactRenderer: {
    render: (pageId: number, path: string, params: any) => void;
    destroy: (pageId: number) => void;
  };

  var ReactRouter: {
    register: (path: string, componentFactory: any) => void;
    push: (path: string, params?: any) => void;
    pop: () => void;
  };

  var queueMicrotask: (fn: () => void) => void;
  var __handleTimer: (id: number) => void;
  var __dispatchEvent: (id: string, payload: any) => void;

  namespace JSX {
    interface IntrinsicElements {
      Column: any;
      Row: any;
      Text: any;
      Image: any;
      Container: any;
      Padding: any;
      SizedBox: any;
      Divider: any;
      Button: any;
      ListView: any;
      ListTile: any;
      SingleChildScrollView: any;
      Scaffold: any;
      AppBar: any;
      Center: any;
      Expanded: any;
      Icon: any;
      TextField: any;
      CircularProgressIndicator: any;
      GestureDetector: any;
      Stack: any;
      Positioned: any;
      Opacity: any;
      DecoratedBox: any;
      [elemName: string]: any;
    }
  }
}

export { };
