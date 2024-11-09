import React from 'react';
import { Alert, Button } from 'react-bootstrap';


function ErrorAlert({ error, onDismiss, onRetry }) {
  if (!error) return null;
  
  const errorMessage = typeof error === 'string' ? error : error?.message || 'An error occurred';

  return (
    <Alert variant="danger" dismissible onClose={onDismiss} role="alert" className="mb-3">
      <Alert.Heading>Error</Alert.Heading>
      <p>{errorMessage}</p>
      {onRetry && (
        <div className="mt-2">
          <Button variant="outline-danger" size="sm" onClick={onRetry}>
            Try Again
          </Button>
        </div>
      )}
    </Alert>
  );
}

export default ErrorAlert;