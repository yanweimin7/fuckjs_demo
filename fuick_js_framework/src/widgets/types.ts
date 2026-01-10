export interface EdgeInsets {
    left?: number;
    top?: number;
    right?: number;
    bottom?: number;
}

export interface BoxDecoration {
    color?: string;
    borderRadius?: number | {
        topLeft?: number;
        topRight?: number;
        bottomLeft?: number;
        bottomRight?: number;
    };
}

export interface BaseProps {
    key?: string | number;
    children?: any;
}

export interface WidgetProps extends BaseProps {
    padding?: number | EdgeInsets;
    margin?: number | EdgeInsets;
}
