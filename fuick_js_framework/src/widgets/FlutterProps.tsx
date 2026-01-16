import React, { ReactNode } from 'react';

export interface FlutterPropsProps {
  propsKey: string;
  children?: ReactNode;
}

/**
 * FlutterProps is a special component used to map children to specific named properties
 * in the parent Flutter widget.
 *
 * Example:
 * <flutter-icon-button>
 *   <FlutterProps propsKey="icon">
 *     <Icon data="add" />
 *   </FlutterProps>
 * </flutter-icon-button>
 */
export class FlutterProps extends React.Component<FlutterPropsProps> {
  render(): ReactNode {
    // The renderer will handle this special component type
    return React.createElement('FlutterProps', { propsKey: this.props.propsKey }, this.props.children);
  }
}
