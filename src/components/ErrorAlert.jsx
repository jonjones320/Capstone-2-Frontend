import React from 'react';
import { Alert, Button } from 'react-bootstrap';

function ErrorAlert({ error, onDismiss, onRetry }) {
  if (!error) return null;

  return (
    <Alert variant="danger" dismissible onClose={onDismiss} className="mb-3">
      <Alert.Heading>Error</Alert.Heading>
      <p>{error}</p>
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