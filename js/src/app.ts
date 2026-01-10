import React from 'react';
import { Router, Runtime } from 'fuick_js_framework';
import HomePage from './pages/home';
import DetailPage from './pages/detail';
import ExamplesPage from './pages/examples';
import ComplexPage from './pages/complex';
import PartialRefreshPage from './pages/partial_refresh';

export function initApp() {
  Runtime.bindGlobals();
  console.log('initApp');
  Router.register('/', () => React.createElement(HomePage));
  Router.register('/detail', (params: any) => React.createElement(DetailPage, params));
  Router.register('/examples', (params: any) => React.createElement(ExamplesPage, params));
  Router.register('/complex', (params: any) => React.createElement(ComplexPage, params));
  Router.register('/partial_refresh', (params: any) => React.createElement(PartialRefreshPage, params));
}
