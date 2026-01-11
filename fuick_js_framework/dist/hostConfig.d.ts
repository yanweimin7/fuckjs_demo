import { PageContainer } from './PageContainer';
export declare const TEXT_TYPE = "Text";
export declare function getNodeById(id: number): Node | undefined;
export declare class Node {
    id: number;
    type: string;
    props: any;
    children: Node[];
    parent?: Node;
    container?: PageContainer;
    private eventCallbacks;
    constructor(type: string, props: any, container?: PageContainer);
    applyProps(newProps: any): void;
    saveCallback(key: string, fn: Function): void;
    clearCallbacks(): void;
    getCallback(key: string): Function | undefined;
    toDsl(): any;
    destroy(): void;
}
export declare const createHostConfig: () => any;
