import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithContext, mockUser } from '../setup.cjs';
import Signup from '../../components/Signup';
import RannerApi from '../../../api';

describe('Signup', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(require('react-router-dom'), 'useNavigate')
      .mockImplementation(() => mockNavigate);
  });

  test('renders signup form', () => {
    renderWithContext(<Signup />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('handles successful registration', async () => {
    RannerApi.signUp.mockResolvedValueOnce('fake-token');
    RannerApi.login.mockResolvedValueOnce('fake-token');

    renderWithContext(<Signup />);

    // Fill out form.
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: mockUser.username }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: mockUser.firstName }
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: mockUser.lastName }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: mockUser.email }
    });

    fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(RannerApi.signUp).toHaveBeenCalledWith({
        username: mockUser.username,
        password: 'password123',
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email
      });
      expect(mockNavigate).toHaveBeenCalledWith('/origin');
    });
  });

  test('handles duplicate email error', async () => {
    RannerApi.signUp.mockRejectedValueOnce({
      message: 'duplicate key value violates unique constraint "users_email_key"'
    });

    renderWithContext(<Signup />);

    // Fill out form with duplicate email.
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: mockUser.email }
    });
    fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert'))
        .toHaveTextContent(/email already registered/i);
    });
  });

  test('validates required fields', async () => {
    renderWithContext(<Signup />);

    // Submit empty form.
    fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getAllByRole('alert')).toHaveLength(1);
    });
  });

  test('validates email format', async () => {
    renderWithContext(<Signup />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' }
    });
    fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert'))
        .toHaveTextContent(/invalid email format/i);
    });
  });

  test('validates password strength', async () => {
    renderWithContext(<Signup />);

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: '123' } // Too short.
    });
    fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert'))
        .toHaveTextContent(/password must be at least/i);
    });
  });

  test('handles generic signup error', async () => {
    RannerApi.signUp.mockRejectedValueOnce(new Error('Signup failed'));

    renderWithContext(<Signup />);

    // Fill out form.
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: mockUser.username }
    });
    fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert'))
        .toHaveTextContent(/something went wrong/i);
    });
  });
});