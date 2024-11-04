import { screen, waitFor } from '@testing-library/react';
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

  const renderLogout = (isAuthenticated = true) => {
    const contextValue = {
      ...mockAuthContext,
      currentUser: isAuthenticated ? mockUser : null
    };

    return renderWithContext(
      <AuthContext.Provider value={contextValue}>
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

  test('displays thank you message', async () => {
    renderLogout();
    expect(screen.getByText(/thanks for coming/i)).toBeInTheDocument();
  });

  test('shows login and signup buttons', async () => {
    renderLogout();
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
  });

  test('handles logout error', async () => {
    mockLogout.mockRejectedValueOnce(new Error('Logout failed'));
    renderLogout();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/logout failed/i);
    });
  });

  test('login and signup buttons link to correct routes', () => {
    renderLogout();
    expect(screen.getByRole('link', { name: /login/i })).toHaveAttribute('href', '/login');
    expect(screen.getByRole('link', { name: /sign up/i })).toHaveAttribute('href', '/signup');
  });
});