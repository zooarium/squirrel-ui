import React from 'react';

// ErrorBoundary — catches render errors anywhere in the subtree.
// Wrap around AppRouter (or any subtree) to prevent full-app white screens.
//
// Usage — default fallback:
//   <ErrorBoundary><App /></ErrorBoundary>
//
// Usage — custom fallback:
//   <ErrorBoundary fallback={(error, reset) => <MyError error={error} onRetry={reset} />}>
//     <App />
//   </ErrorBoundary>
//
// Sentry: uncomment the Sentry.captureException line in componentDidCatch.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Sentry.captureException(error, { extra: { componentStack: info.componentStack } });
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error, this.reset);
      }
      return (
        <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 gap-3 text-center px-3">
          <h2 className="text-danger">Something went wrong</h2>
          <p className="text-secondary">
            {this.state.error?.message ?? 'An unexpected error occurred.'}
          </p>
          <button className="btn btn-primary" onClick={this.reset}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
