import { screen, waitFor } from '@testing-library/react';
import { mockUser } from '../setup.cjs';
import { renderWithContext } from '../testUtils';
import { AuthContext } from '../context/AuthContext';
import Logout from '../../components/Logout';

describe('Logout', () => {
  const mockLogout = jest.fn();

  // Create currentUser context and run Logout component.
  const renderLogout = (isAuthenticated = true) => {
    return renderWithContext(
      <AuthContext.Provider 
        value={{ 
          currentUser: isAuthenticated ? mockUser : null, 
          logout: mockLogout 
        }}
      >
        <Logout />
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('performs logout on mount', async () => {
    renderLogout();

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });
  });

  test('displays thank you message', () => {
    renderLogout();
    expect(screen.getByText(/thanks for coming/i)).toBeInTheDocument();
  });

  test('shows login and signup buttons', () => {
    renderLogout();
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
  });

  test('handles logout error', async () => {
    mockLogout.mockRejectedValueOnce(new Error('Logout failed'));
    renderLogout();

    await waitFor(() => {
      expect(screen.getByRole('alert'))
        .toHaveTextContent(/there was an error logging out/i);
    });
  });

  test('login button links to correct route', () => {
    renderLogout();
    const loginLink = screen.getByRole('link', { name: /login/i });
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  test('signup button links to correct route', () => {
    renderLogout();
    const signupLink = screen.getByRole('link', { name: /sign up/i });
    expect(signupLink).toHaveAttribute('href', '/signup');
  });
});