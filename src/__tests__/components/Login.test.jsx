import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithContext } from '../utils/testUtils';
import { mockUser } from '../helpers/testData';
import Login from '../../components/Login';
import RannerApi from '../../../api';

// Mock router hooks.
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form correctly', () => {
    renderWithContext(<Login />);
    
    expect(screen.getByRole('textbox', { name: /username/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('handles successful login', async () => {
    RannerApi.login.mockResolvedValueOnce('fake-token');
    renderWithContext(<Login />);

    fireEvent.change(screen.getByRole('textbox', { name: /username/i }), {
      target: { value: mockUser.username }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(RannerApi.login).toHaveBeenCalledWith({
        username: mockUser.username,
        password: 'password123'
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('displays error message on failed login', async () => {
    const errorMessage = 'Invalid username or password';
    RannerApi.login.mockRejectedValueOnce(new Error(errorMessage));
    
    renderWithContext(<Login />);

    fireEvent.change(screen.getByRole('textbox', { name: /username/i }), {
      target: { value: 'wronguser' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpass' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(async () => {
      const alertMessage = screen.getByRole('alert');
      expect(alertMessage).toHaveTextContent(errorMessage);
    });
  });
});