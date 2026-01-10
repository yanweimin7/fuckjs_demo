export declare function getNodeById(id: number): Node | undefined;
export declare class Node {
    id: number;
    type: string;
    props: any;
    children: Node[];
    parent?: Node;
    private eventCallbacks;
    constructor(type: string, props: any);
    applyProps(newProps: any): void;
    saveCallback(key: string, fn: Function): void;
    getCallback(key: string): Function | undefined;
    destroy(): void;
}
export declare const createHostConfig: (onCommit: (pageId: number, root: Node | null, changedNodes: Set<Node>, deletedIds: Set<number>) => void) => any;
