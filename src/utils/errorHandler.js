import React from 'react';

// Custom error classes
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

/**
 * Central error handling utility.
 */
export const ErrorHandler = {
  handleApiError: (error) => {
    if (error.response) {
      const status = error.response.status;
      let message = error.response.data?.error?.message || 'An error occurred';
      
      // Handle specific API error responses.
      if (error.response.data?.error?.code) {
        const errorCode = error.response.data.error.code;
        switch (errorCode) {
          case 141:
            message = "The flight search service is temporarily unavailable. Please try again in a few minutes.";
            break;
          case 4926:
            message = "We couldn't find any flights matching your criteria. Please try different dates or locations.";
            break;
          default:
            message = error.response.data.error.message || message;
        }
      }
      
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

export { ApiError, AuthenticationError, ValidationError };