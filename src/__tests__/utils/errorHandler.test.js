import { render, renderHook, act } from '@testing-library/react';
import { ErrorHandler, useErrorHandler } from '../../utils/errorHandler';

afterEach(() => {
  // Cleanup any rendered hooks after each test.
  jest.clearAllMocks();
});

describe('ErrorHandler Utility', () => {
  describe('handleApiError', () => {
    test('handles API response errors', () => {
      const error = {
        response: {
          status: 404,
          data: { error: 'Resource not found' }
        }
      };

      expect(() => ErrorHandler.handleApiError(error)).toThrow('Resource not found');
    });

    test('handles network errors', () => {
      const error = {
        request: {},
        message: 'Network Error'
      };

      expect(() => ErrorHandler.handleApiError(error)).toThrow('Network error - please check your connection and try again');
    });

    test('handles validation errors', () => {
      const error = {
        response: {
          status: 422,
          data: { fields: { email: 'Invalid email format' } }
        }
      };

      try {
        ErrorHandler.handleApiError(error);
      } catch (e) {
        expect(e.fields).toEqual({ email: 'Invalid email format' });
      }
    });
  });
});

describe('useErrorHandler Hook', () => {
  test('handles and clears errors', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleError(new Error('Test error'));
    });

    expect(result.current.error.message).toBe('Test error');

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
});