import React from 'react';
import * as Navigator from './navigator';
type ComponentFactory = (params?: any) => React.ReactElement;
export declare function register(path: string, componentFactory: ComponentFactory): void;
export declare function match(path: string): ComponentFactory | undefined;
export declare const Router: {
    register: typeof register;
    match: typeof match;
    push: typeof Navigator.push;
    pop: typeof Navigator.pop;
};
export {};
