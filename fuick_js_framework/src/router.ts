import React from 'react';
import * as Navigator from './navigator';

type ComponentFactory = (params?: any) => React.ReactElement;
const routes: Record<string, ComponentFactory> = {};

export function register(path: string, componentFactory: ComponentFactory) {
    routes[path] = componentFactory;
}

export function match(path: string): ComponentFactory | undefined {
    return routes[path];
}

export const Router = {
    register,
    match,
};
