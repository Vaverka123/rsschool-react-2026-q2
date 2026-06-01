import type { ErrorInfo } from 'react';
import { Component } from 'react';

import type {
  ErrorBoundaryProps,
  ErrorBoundaryState,
} from '@/types/errorBoundary';

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            style={{
              border: '1px solid var(--border)',
              background: 'var(--bg)',
            }}
            className="flex flex-col items-center gap-4 max-w-md mx-auto mt-20 p-8 rounded-2xl text-center"
          >
            <i
              className="ti ti-mood-sad"
              style={{ fontSize: 48, color: 'var(--accent)' }}
              aria-hidden="true"
            />
            <h2 style={{ color: 'var(--text-h)' }}>Something went wrong</h2>
            <p style={{ color: 'var(--text)' }} className="text-sm">
              {this.state.error?.message ?? 'An unexpected error occurred.'}
            </p>
            <button
              onClick={this.handleReset}
              style={{ background: 'var(--accent)', color: '#fff' }}
              className="px-6 h-10 text-sm font-medium rounded-xl hover:opacity-90 transition-opacity"
            >
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
