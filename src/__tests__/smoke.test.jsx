import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider, { AuthContext } from '../context/AuthContext';
import App from '../App';

// Mock the API calls.
jest.mock('../../api', () => ({
  login: jest.fn(),
  signUp: jest.fn(),
  getAirportSuggestions: jest.fn(),
  searchFlightOffers: jest.fn(),
  postTrip: jest.fn(),
}));

describe('Ranner Frontend Smoke Tests', () => {
  // Custom render function that includes providers.
  const renderApp = () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  // Helper function to set up auth context for testing.
  const renderWithAuth = (currentUser = null) => {
    // Create a test component that uses AuthContext directly.
    const TestComponent = () => (
      <AuthContext.Provider value={{ currentUser, login: jest.fn(), logout: jest.fn() }}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthContext.Provider>
    );
    
    return render(<TestComponent />);
  };

  beforeEach(() => {
    // Clear all mocks before each test.
    jest.clearAllMocks();
  });

  describe('Basic Navigation', () => {
    test('Home page renders correctly', () => {
      renderApp();
      expect(screen.getByText(/explore the world/i)).toBeInTheDocument();
      expect(screen.getByText(/log in/i)).toBeInTheDocument();
      expect(screen.getByText(/sign up/i)).toBeInTheDocument();
    });

    test('Can navigate to login page', async () => {
      renderApp();
      fireEvent.click(screen.getByText(/log in/i));
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
      });
    });

    test('Can navigate to signup page', async () => {
      renderApp();
      fireEvent.click(screen.getByText(/sign up/i));
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
      });
    });
  });

  describe('Authentication Flow', () => {
    test('Login form works correctly', async () => {
      renderApp();
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
      
      await waitFor(() => {
        expect(screen.queryByText(/invalid username\/password/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Trip Planning Flow', () => {
    test('Can access trip planning when logged in', async () => {
      // Render with a mock logged-in user.
      renderWithAuth({ username: 'testuser', isAdmin: false });
      
      await waitFor(() => {
        expect(screen.getByText(/start your journey/i)).toBeInTheDocument();
      });
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