import React from 'react';
import HomePage from './pages/home';
import DetailPage from './pages/detail';
import * as Runtime from './runtime';
import * as Router from './router';

export function initApp() {
  Runtime.bindGlobals();
  console.log('initApp');
  Router.register('/', () => React.createElement(HomePage));
  Router.register('/detail', (params: any) => React.createElement(DetailPage, params));
}
