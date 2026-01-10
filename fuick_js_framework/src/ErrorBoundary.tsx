import React from 'react';

interface Props {
  children?: React.ReactNode;
  fallback?: React.ReactNode | ((error: Error) => React.ReactNode);
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (typeof this.props.fallback === 'function') {
        return (this.props.fallback as Function)(this.state.error!);
      }
      return (this.props.fallback as React.ReactNode) || null;
    }

    return this.props.children;
  }
}
