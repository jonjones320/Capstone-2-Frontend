/**
 * Custom error types for specific error scenarios.
 */
export class ApiError extends Error {
    constructor(message, status) {
      super(message);
      this.name = 'ApiError';
      this.status = status;
    }
}
  
  export class ValidationError extends Error {
  constructor(message, fields) {
    super(message);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}

export class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

/**
 * Central error handling utility.
 */
export const ErrorHandler = {
  // Handle API errors.
  handleApiError: (error) => {
    if (error.response) {
      // Server responded with error.
      const status = error.response.status;
      const message = error.response.data?.error || 'An error occurred';
      
      switch (status) {
        case 401:
          throw new AuthenticationError('Please log in to continue');
        case 403:
          throw new AuthenticationError('You are not authorized to perform this action');
        case 404:
          throw new ApiError('Resource not found', status);
        case 422:
          throw new ValidationError('Invalid data provided', error.response.data?.fields);
        default:
          throw new ApiError(message, status);
      }
    } else if (error.request) {
      // Request made but no response.
      throw new ApiError('Network error - please try again', 0);
    } else {
      // Error in request setup.
      throw new ApiError('An error occurred while processing your request', 0);
    }
  },

  // Format error message for display.
  formatErrorMessage: (error) => {
    if (error instanceof ValidationError && error.fields) {
      return Object.entries(error.fields)
        .map(([field, message]) => `${field}: ${message}`)
        .join('\n');
    }
    return error.message;
  },

  // Log error for debugging.
  logError: (error, context = '') => {
    console.error(`Error ${context}:`, {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error.status && { status: error.status }),
      ...(error.fields && { fields: error.fields })
    });
  }
};

/**
 * Custom hook for error handling in components.
 */
import { useState, useCallback } from 'react';

export const useErrorHandler = () => {
  const [error, setError] = useState(null);

  const handleError = useCallback((error) => {
    ErrorHandler.logError(error);
    setError(error);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
};