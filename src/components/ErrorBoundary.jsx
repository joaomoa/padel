import React from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1 className="text-red-500 text-center">Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;