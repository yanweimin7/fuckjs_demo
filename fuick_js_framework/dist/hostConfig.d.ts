interface Node {
    type: string;
    props: any;
    children: Node[];
}
export declare const createHostConfig: (onCommit: (pageId: number, root: Node | null) => void) => any;
export {};
