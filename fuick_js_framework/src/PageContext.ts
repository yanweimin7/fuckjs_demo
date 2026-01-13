import React from 'react';

export interface PageContextValue {
  pageId: number;
}

export const PageContext = React.createContext<PageContextValue>({ pageId: 0 });
