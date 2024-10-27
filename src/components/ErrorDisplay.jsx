import React from 'react';
import { Alert } from 'react-bootstrap';
import { 
    ErrorHandler, 
    ValidationError, 
    AuthenticationError 
  } from '../utils/errorHandler';

const ErrorDisplay = ({ error, onClose }) => {
  if (!error) return null;

  let variant = 'danger';
  if (error instanceof ValidationError) {
    variant = 'warning';
  } else if (error instanceof AuthenticationError) {
    variant = 'info';
  }

  return (
    <Alert 
      variant={variant}
      role="alert"
      dismissible 
      onClose={onClose}
      className="mb-4"
    >
      <Alert.Heading>
        {error.name === 'ValidationError' ? 'Please check your input' : 'Error'}
      </Alert.Heading>
      <p className="mb-0">{ErrorHandler.formatErrorMessage(error)}</p>
    </Alert>
  );
};

export default ErrorDisplay;