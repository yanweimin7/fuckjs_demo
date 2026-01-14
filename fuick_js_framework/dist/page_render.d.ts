export declare function ensureRenderer(): any;
export declare function render(pageId: number, path: string, params: any): void;
export declare function destroy(pageId: number): void;
export declare function getItemDSL(pageId: number, refId: string, index: number): any;
export declare function elementToDsl(pageId: number, element: any): any;
export declare function notifyLifecycle(pageId: number, type: 'visible' | 'invisible'): void;
export declare function getContainer(pageId: number): any;
