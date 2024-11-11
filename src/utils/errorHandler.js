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
    if (error.response) {
      const errorData = error.response.data?.error;
      const status = error.response.status;
      const message = error.message || errorData?.message;

      // Handle specific error patterns
      if (message?.includes('duplicate key')) {
        if (message.includes('users_email_key')) {
          throw new EmailInUseError();
        }
        if (message.includes('users_username_key')) {
          throw new UsernameTakenError();
        }
      }

      // Handle status codes.
      switch (status) {
        case 401:
          if (message?.includes('password')) {
            throw new PasswordError('Current password incorrect');
          }
          throw new AuthenticationError('Please log in to continue');
        case 401:
          throw new AuthenticationError('Please log in to continue');
        case 403:
          throw new AuthenticationError('You are not authorized to perform this action');
        case 404:
          if (code === 'NO_FLIGHTS_FOUND') {
            throw new ApiError('No flights found for these search criteria. Please try different dates or locations.');
          }
          throw new ApiError('Resource not found', status);
        case 422:
          throw new ValidationError('Invalid data provided', error.response.data?.fields);
        default:
          throw new ApiError(message, status);
      }
    } else if (!navigator.onLine) {
      throw new NetworkError();
    } else {
      throw new ApiError('An error occurred while processing your request', 0);
    }
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