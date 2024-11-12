import React from 'react';

// Custom error classes. 
class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

class ValidationError extends Error {
  constructor(message, fields) {
    super(message);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}

class RetryableError extends Error {
  constructor(message, retryAfter = 1000) {
    super(message);
    this.name = 'RetryableError';
    this.retryAfter = retryAfter;
  }
}

class EmailInUseError extends ValidationError {
  constructor() {
    super('This email is already in use by another account');
  }
}

class UsernameTakenError extends ValidationError {
  constructor() {
    super('This username is taken');
  }
}

class PasswordError extends ValidationError {
  constructor(message) {
    super(message);
  }
}

class NetworkError extends ApiError {
  constructor() {
    super('No internet connection. Please check your network', 0);
  }
}

/**
 * Central error handling utility.
 */

export const ErrorHandler = {
  handleApiError: (error) => {
    // For error objects like {error: {message: "...", status: 400}}.
    if (error?.error?.message) {
      const status = error.error.status;
      switch (status) {
        case 401:
          return new AuthenticationError(error.error.message);
        case 403:
          return new AuthenticationError(error.error.message);
        case 404:
          return new ApiError(error.error.message, status);
        default:
          return new ApiError(error.error.message, status);
      }
    }

    // For direct message errors.
    if (error?.message) {
      return new ApiError(error.message);
    }

    // No internet connection.
    if (!navigator.onLine) {
      return new ApiError('No internet connection. Please check your network');
    }

    // Fallback for unexpected error formats.
    return new ApiError('An error occurred while processing your request');
  }
};

// Custom hook for handling errors in components.
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);

  const handleError = (error) => {
    setError(error);
  };

  const clearError = () => {
    setError(null);
  };

  return { error, handleError, clearError };
};

export {
  ApiError,
  AuthenticationError,
  ValidationError,
  RetryableError,
  EmailInUseError,
  UsernameTakenError,
  PasswordError,
  NetworkError
};