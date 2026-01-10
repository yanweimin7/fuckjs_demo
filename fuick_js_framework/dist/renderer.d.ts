export declare function createEvent(fn: Function, pageId: number, nodeId: number, key: string): string;
export declare function dispatchEvent(id: string, payload: any): void;
export declare function createRenderer(): {
    update(element: any, pageId: number): void;
    destroy(pageId: number): void;
    createEvent: typeof createEvent;
    dispatchEvent: typeof dispatchEvent;
};
