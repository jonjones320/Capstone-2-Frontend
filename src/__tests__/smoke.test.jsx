import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import App from '../App';

// Mock Routes.
jest.mock('../Routes', () => {
  return {
    __esModule: true,
    default: ({ children }) => <div data-testid="mock-routes">{children}</div>
  };
});

// Mock Ranner and Amadeus API calls.
jest.mock('../../api', () => ({
  login: jest.fn(),
  signUp: jest.fn(),
  getAirportSuggestions: jest.fn(),
  searchFlightOffers: jest.fn(),
  postTrip: jest.fn(),
}));

const defaultAuthContext = {
  currentUser: null,
  login: jest.fn(),
  logout: jest.fn(),
  setCurrentUser: jest.fn(),
  token: null,
  storeToken: jest.fn(),
  clearToken: jest.fn()
};

describe('Ranner Frontend Smoke Tests', () => {
  // Custom render function with all required providers
  const renderApp = (authContextValue = defaultAuthContext) => {
    return render(
      <AuthContext.Provider value={authContextValue}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthContext.Provider>
    );
  };

  // Helper for rendering with authenticated user.
  const renderWithAuth = (currentUser) => {
    const authValue = {
      ...defaultAuthContext,
      currentUser
    };
    return renderApp(authValue);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.history.pushState({}, '', '/');
  });

  describe('Basic Navigation', () => {
    test('Home page renders correctly', () => {
      renderApp();
      expect(screen.getByText(/explore the world/i)).toBeInTheDocument();
    });

    test('Can navigate to login page', async () => {
      renderApp();
      const loginLink = screen.getByText(/log in/i);
      fireEvent.click(loginLink);
      await waitFor(() => {
        expect(window.location.pathname).toBe('/login');
      });
    });

    test('Can navigate to signup page', async () => {
      renderApp();
      const signupLink = screen.getByText(/sign up/i);
      fireEvent.click(signupLink);
      await waitFor(() => {
        expect(window.location.pathname).toBe('/signup');
      });
    });
  });

  describe('Authentication Flow', () => {
    test('Login form works correctly', async () => {
      const mockLogin = jest.fn();
      renderApp({
        ...defaultAuthContext,
        login: mockLogin
      });

      // Navigate to login.
      fireEvent.click(screen.getByText(/log in/i));

      // Fill in the login form.
      await waitFor(() => {
        fireEvent.change(screen.getByPlaceholderText(/username/i), {
          target: { value: 'testuser' }
        });
        fireEvent.change(screen.getByPlaceholderText(/password/i), {
          target: { value: 'password123' }
        });
      });

      // Submit login form.
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      // Verify login was called.
      expect(mockLogin).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123'
      });
    });
  });

  describe('Trip Planning Flow', () => {
    test('Can access trip planning when logged in', () => {
      renderWithAuth({ username: 'testuser', isAdmin: false });
      expect(screen.getByText(/start your journey/i)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('Shows error messages appropriately', async () => {
      renderApp();
      fireEvent.click(screen.getByText(/log in/i));
      
      // Submit empty form.
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
      });
    });
  });
});