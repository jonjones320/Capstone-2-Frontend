import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithContext, mockUser } from '../setup';
import Login from '../../components/Login';
import RannerApi from '../../../api';

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form correctly', () => {
    renderWithContext(<Login />);
    
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('handles successful login', async () => {
    RannerApi.login.mockResolvedValueOnce('fake-token');
    renderWithContext(<Login />);

    // Fill form.
    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { name: 'username', value: mockUser.username }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { name: 'password', value: 'password123' }
    });

    // Submit form.
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(RannerApi.login).toHaveBeenCalledWith({
        username: mockUser.username,
        password: 'password123'
      });
    });
  });

  test('displays error message on failed login', async () => {
    const errorMessage = 'Invalid username/password';
    RannerApi.login.mockRejectedValueOnce(new Error(errorMessage));
    renderWithContext(<Login />);

    // Fill and submit form.
    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { name: 'username', value: 'wronguser' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { name: 'password', value: 'wrongpass' }
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
    });
  });
});