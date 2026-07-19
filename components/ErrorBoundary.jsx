'use client';
import { Component } from 'react';

/**
 * ErrorBoundary — catches render errors in any child component tree.
 * Prevents a single broken section from crashing the entire StadiumIQ dashboard.
 * Provides a "Try Again" recovery button with accessible alert semantics.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Caught component error:', error.message, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="w-full py-20 px-6 flex items-center justify-center border-b monad-border"
        >
          <div className="max-w-md text-center">
            <div className="font-mono text-xs uppercase text-red-500 mb-3">Component Error</div>
            <h3 className="font-bold text-black text-xl mb-2">Section failed to load</h3>
            <p className="text-sm text-neutral-500 mb-6 leading-relaxed">
              This section encountered an error. The rest of StadiumIQ is still fully operational.
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="font-mono text-xs uppercase border border-neutral-300 px-6 py-2.5 rounded-lg hover:bg-neutral-50 hover:border-black transition-all text-black"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
