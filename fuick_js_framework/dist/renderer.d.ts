export declare function dispatchEvent(eventObj: any, payload: any): void;
export declare function createRenderer(): {
    update(element: any, pageId: number): void;
    destroy(pageId: number): void;
    dispatchEvent: typeof dispatchEvent;
};
