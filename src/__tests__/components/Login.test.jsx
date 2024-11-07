import { screen, fireEvent } from '@testing-library/react';
import { renderWithContext, defaultAuthContext } from '../utils/testUtils';
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
    
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
  
  test('handles successful login', async () => {
    RannerApi.login.mockResolvedValueOnce('fake-token');
    renderWithContext(<Login />);
  
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: mockUser.username }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
  });

  test('displays error message on failed login', async () => {
    const errorMessage = 'ErrorLogin failed';
    const mockAuthLogin = jest.fn().mockRejectedValueOnce(new Error(errorMessage));
    
    renderWithContext(<Login />, {
      // Override the login function.
      user: null,
      authContext: {
        currentUser: null,
        login: mockAuthLogin,
        logout: defaultAuthContext.logout
      }
    });
  
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'wronguser' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpass' }
    });
      
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
  
    expect(await screen.findByRole('alert')).toHaveTextContent(errorMessage);
  });
});