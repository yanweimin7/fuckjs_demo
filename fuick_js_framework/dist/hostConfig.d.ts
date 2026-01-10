export interface Node {
    id: number;
    type: string;
    props: any;
    children: Node[];
}
export declare const createHostConfig: (onCommit: (pageId: number, root: Node | null, changedNodes: Set<Node>) => void) => any;
