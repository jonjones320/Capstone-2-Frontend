import { screen, fireEvent, waitFor } from '@testing-library/react';
import { mockUser, mockTrip } from '../helpers/testData';
import { renderWithContext } from '../utils/testUtils';
import Profile from '../../components/Profile';
import RannerApi from '../../../api';
import AuthContext from '../../context/AuthContext';

describe('Profile', () => {
  // Mock AuthContext with a logged-in user.
  const mockAuthContext = {
    currentUser: mockUser,
    login: jest.fn(),
    logout: jest.fn()
  };

  const renderProfileWithAuth = () => {
    return renderWithContext(
      <AuthContext.Provider value={mockAuthContext}>
        <Profile />
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    // Clear mocks and set up default successful responses.
    jest.clearAllMocks();
    RannerApi.getUser.mockResolvedValue(mockUser);
    RannerApi.getTripsByUsername.mockResolvedValue([mockTrip]);
    RannerApi.patchUser.mockImplementation((username, data) => Promise.resolve({ ...mockUser, ...data }));
  });

  test('renders loading state initially', () => {
    renderProfileWithAuth();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders user profile and trips after loading', async () => {
    renderProfileWithAuth();

    // Wait for both API calls to resolve and loading to finish.
    await waitFor(() => {
      expect(RannerApi.getUser).toHaveBeenCalledWith(mockUser.username);
      expect(RannerApi.getTripsByUsername).toHaveBeenCalledWith(mockUser.username);
    });

    // Now check for content.
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(screen.getByText(mockUser.username)).toBeInTheDocument();
      expect(screen.getByText(mockTrip.name)).toBeInTheDocument();
    });
  });

  test('handles edit mode toggle', async () => {
    renderProfileWithAuth();

    // Wait for initial data load.
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Click edit button and verify form appears.
    fireEvent.click(screen.getByText(/edit profile/i));
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  test('handles API error', async () => {
    // Mock API error.
    RannerApi.getUser.mockRejectedValueOnce(new Error('Failed to fetch profile'));
    
    renderProfileWithAuth();

    // Wait for error to appear.
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/failed to fetch profile/i);
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  test('updates profile successfully', async () => {
    const updatedUser = {
      ...mockUser,
      firstName: 'Updated',
      lastName: 'Name'
    };

    renderProfileWithAuth();

    // Wait for initial data load.
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Enter edit mode.
    fireEvent.click(screen.getByText(/edit profile/i));

    // Fill out form.
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'Updated' }
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Name' }
    });

    // Submit form.
    fireEvent.click(screen.getByText(/save changes/i));

    // Verify API call and state update.
    await waitFor(() => {
      expect(RannerApi.patchUser).toHaveBeenCalledWith(
        mockUser.username,
        expect.objectContaining({
          firstName: 'Updated',
          lastName: 'Name'
        })
      );
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  test('handles no trips case', async () => {
    // Mock empty trips response.
    RannerApi.getTripsByUsername.mockResolvedValueOnce([]);
    
    renderProfileWithAuth();

    // Wait for API calls to resolve.
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Check for no trips message.
    expect(screen.getByText(/no trips found/i)).toBeInTheDocument();
  });
});