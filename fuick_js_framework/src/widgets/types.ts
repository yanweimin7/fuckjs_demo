export interface EdgeInsets {
    left?: number;
    top?: number;
    right?: number;
    bottom?: number;
    all?: number;
    vertical?: number;
    horizontal?: number;
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
    refId?: string;
}

export interface WidgetProps extends BaseProps {
    padding?: number | EdgeInsets;
    margin?: number | EdgeInsets;
}
