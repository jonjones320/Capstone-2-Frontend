import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import NavBar from '../components/NavBar';

// Initialize mocked API endpoints for navigation testing.
jest.mock('../../api', () => ({
  login: jest.fn(),
  signUp: jest.fn(),
  getAirportSuggestions: jest.fn(),
  searchFlightOffers: jest.fn(),
  postTrip: jest.fn(),
}));

// Create context to authorization testing.
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
  // Custom render function with all required providers.
  const renderApp = (authContextValue = defaultAuthContext) => {
    return render(
      <AuthContext.Provider value={authContextValue}>
        <BrowserRouter>
          <NavBar />
        </BrowserRouter>
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Start at home page.
    window.history.pushState({}, '', '/');
  });

  describe('Navigation Bar Links', () => {
    test('Shows login and signup links when logged out', () => {
      renderApp();
      
      // Use getByRole for more accurate selection of navigate elements.
      expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
    });

    test('Shows user navigation when logged in', () => {
      renderApp({
        ...defaultAuthContext,
        currentUser: { username: 'testuser' }
      });
      // Checks that all elements of the dropdown navbar have loaded for logged in user.
      expect(screen.getByRole('link', { name: /my trips/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /new trip/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /profile/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /logout/i })).toBeInTheDocument();
    });
  });

  describe('Navigating the Links', () => {
    test('Login link points to correct route', () => {
      renderApp();
      const loginLink = screen.getByRole('link', { name: /login/i });
      expect(loginLink).toHaveAttribute('href', '/login');
    });

    test('Signup link points to correct route', () => {
      renderApp();
      const signupLink = screen.getByRole('link', { name: /sign up/i });
      expect(signupLink).toHaveAttribute('href', '/signup');
    });

    test('Profile link points to correct route when logged in', () => {
      renderApp({
        ...defaultAuthContext,
        currentUser: { username: 'testuser' }
      });
      const profileLink = screen.getByRole('link', { name: /profile/i });
      expect(profileLink).toHaveAttribute('href', '/profile');
    });
  });

  describe('Brand Link', () => {
    test('Brand link exists and points to home', () => {
      renderApp();
      const brandLink = screen.getByText('Ranner');
      expect(brandLink).toHaveAttribute('href', '/');
    });
  });

  describe('Media Responsive Behavior', () => {
    test('Shows navbar toggle on mobile', () => {
      renderApp();
      expect(screen.getByRole('button', { name: /toggle navigation/i })).toBeInTheDocument();
    });
  });
});