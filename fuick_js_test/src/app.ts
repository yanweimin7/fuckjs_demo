import React from 'react';
import { Router, Runtime } from 'fuick_js_framework';
import { TestPage1 } from './pages/test1';
import { TestPage2 } from './pages/test2';
import { DemoOpsPage } from './pages/demo_ops';

export function initApp() {
  Runtime.bindGlobals();
  Router.register('/', (params: any) => React.createElement(TestPage1, params));
  Router.register('/test2', (params: any) => React.createElement(TestPage2, params));
  Router.register('/demo_ops', (params: any) => React.createElement(DemoOpsPage, params));
}
