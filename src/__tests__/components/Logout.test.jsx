import { screen, waitFor } from '@testing-library/react';
import { mockUser } from '../helpers/testData';
import { renderWithContext, defaultAuthContext } from '../utils/testUtils';
import Logout from '../../components/Logout';

describe('Logout', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderLogoutComponent = (isAuthenticated = true) => {
    return renderWithContext(<Logout />, {
      user: isAuthenticated ? mockUser : null,
      authContext: {
        currentUser: isAuthenticated ? mockUser : null,
        login: defaultAuthContext.login,
        logout: mockLogout
      }
    });
  };

  test('performs logout on mount', async () => {
    renderLogoutComponent();
    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });
  });

  test('displays thank you message', async () => {
    renderLogoutComponent();
    expect(screen.getByText(/thanks for coming/i)).toBeInTheDocument();
  });

  test('shows login and signup buttons', async () => {
    renderLogoutComponent();
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
  });

  test('handles logout error', async () => {
    mockLogout.mockRejectedValueOnce(new Error('Logout failed'));
    renderLogoutComponent();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/logout failed/i);
    });
  });

  test('login and signup buttons link to correct routes', () => {
    renderLogoutComponent();
    expect(screen.getByRole('link', { name: /login/i }))
      .toHaveAttribute('href', '/login');
    expect(screen.getByRole('link', { name: /sign up/i }))
      .toHaveAttribute('href', '/signup');
  });
});