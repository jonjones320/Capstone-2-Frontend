import React from 'react';
import { Alert, Button, Container } from 'react-bootstrap';

// Custom "last line of defense" error class built on React component constructor.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

// Displays error messages, but most importantly, //
// provides additional UI to help the user escape or try again. //
  render() {
    if (this.state.hasError) {
      return (
        <Container className="mt-5">
          <Alert variant="danger" role="alert">
            <Alert.Heading>Something went wrong</Alert.Heading>
            <p>
              We're sorry, but something unexpected happened. Please try again or contact support if the problem persists.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{ whiteSpace: 'pre-wrap' }}>
                {this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </details>
            )}
            <div className="mt-3">
              <Button variant="outline-primary" onClick={this.handleReset}>
                Try Again
              </Button>
              <Button 
                variant="outline-secondary" 
                className="ms-2"
                onClick={() => window.location.href = '/'}
              >
                Go to Home
              </Button>
            </div>
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;