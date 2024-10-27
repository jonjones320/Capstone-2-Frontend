import { screen, waitFor, act } from '@testing-library/react';
import { mockUser } from '../helpers/testData';
import { renderWithContext } from '../utils/testUtils';
import AuthContext from '../../context/AuthContext';
import Logout from '../../components/Logout';

describe('Logout', () => {
  const mockLogout = jest.fn();
  
  const mockAuthContext = {
    currentUser: mockUser,
    login: jest.fn(),
    logout: mockLogout
  };

  const renderLogout = async (isAuthenticated = true) => {
    const contextValue = {
      ...mockAuthContext,
      currentUser: isAuthenticated ? mockUser : null
    };

    await act(async () => {
      renderWithContext(
        <AuthContext.Provider value={contextValue}>
          <Logout />
        </AuthContext.Provider>
      );
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('performs logout on mount', async () => {
    await renderLogout();
    expect(mockLogout).toHaveBeenCalled();
  });

  test('displays thank you message', async () => {
    await renderLogout();
    expect(screen.getByText(/thanks for coming/i)).toBeInTheDocument();
  });

  test('shows login and signup buttons', async () => {
    await renderLogout();
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
  });

  test('handles logout error', async () => {
    mockLogout.mockRejectedValueOnce(new Error('Logout failed'));
    
    await renderLogout();

    // Wait for error message to appear.
    await waitFor(() => {
      expect(screen.getByRole('alert'))
        .toHaveTextContent(/ErrorLogout failed/i);
    });
  });

  test('login button links to correct route', async () => {
    await renderLogout();
    const loginLink = screen.getByRole('link', { name: /login/i });
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  test('signup button links to correct route', async () => {
    await renderLogout();
    const signupLink = screen.getByRole('link', { name: /sign up/i });
    expect(signupLink).toHaveAttribute('href', '/signup');
  });
});