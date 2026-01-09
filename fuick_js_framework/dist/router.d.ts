import React from 'react';
type ComponentFactory = (params?: any) => React.ReactElement;
export declare function register(path: string, componentFactory: ComponentFactory): void;
export declare function match(path: string): ComponentFactory | undefined;
export declare const Router: {
    register: typeof register;
    match: typeof match;
};
export {};
