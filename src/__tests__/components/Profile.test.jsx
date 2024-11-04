import { screen, fireEvent, waitFor } from '@testing-library/react';
import { mockUser, mockTrip } from '../helpers/testData';
import { renderWithContext } from '../utils/testUtils';
import Profile from '../../components/Profile';
import RannerApi from '../../../api';

describe('Profile', () => {
  beforeEach(() => {
    // Set up default responses.
    const userPromise = Promise.resolve(mockUser);
    const tripsPromise = Promise.resolve([mockTrip]);

    RannerApi.getUser.mockImplementation(() => userPromise);
    RannerApi.getTripsByUsername.mockImplementation(() => tripsPromise);
  });

  test('renders loading state initially', () => {
    renderWithContext(<Profile />, { user: mockUser });
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders user profile and trips after loading', async () => {
    renderWithContext(<Profile />, { user: mockUser });

    // Wait for both API calls to resolve and loading to finish.
    await waitFor(() => {
      expect(RannerApi.getUser).toHaveBeenCalledWith(mockUser.username);
      expect(RannerApi.getTripsByUsername).toHaveBeenCalledWith(mockUser.username);
    });

    // Now check for content.
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText(mockUser.username)).toBeInTheDocument();
    expect(screen.getByText(mockTrip.name)).toBeInTheDocument();
  });

  test('handles edit mode toggle', async () => {
    renderWithContext(<Profile />, { user: mockUser });

    // Wait for API calls to resolve.
    await waitFor(() => {
      expect(RannerApi.getUser).toHaveBeenCalled();
      expect(RannerApi.getTripsByUsername).toHaveBeenCalled();
    });

    // Verify loading is done.
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    // Click edit button and verify form appears.
    fireEvent.click(screen.getByText(/edit profile/i));
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  test('handles API error', async () => {
    // Mock API error.
    RannerApi.getUser.mockRejectedValueOnce(new Error('Failed to fetch profile'));
    
    renderWithContext(<Profile />, { user: mockUser });

    // Wait for error to appear.
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/failed to fetch profile/i);
    });

    // Verify loading is done.
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  test('updates profile successfully', async () => {
    const updatedUser = {
      ...mockUser,
      firstName: 'Updated',
      lastName: 'Name'
    };

    // Mock successful user update.
    RannerApi.patchUser.mockResolvedValueOnce(updatedUser);
    
    renderWithContext(<Profile />, { user: mockUser });

    // Wait for initial data load.
    await waitFor(() => {
      expect(RannerApi.getUser).toHaveBeenCalled();
      expect(RannerApi.getTripsByUsername).toHaveBeenCalled();
    });

    // Verify loading is done.
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

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

    // Verify API call.
    await waitFor(() => {
      expect(RannerApi.patchUser).toHaveBeenCalledWith(
        mockUser.username,
        expect.objectContaining({
          firstName: 'Updated',
          lastName: 'Name'
        })
      );
    });
  });

  test('handles no trips case', async () => {
    // Mock empty trips response.
    RannerApi.getTripsByUsername.mockResolvedValueOnce([]);
    
    renderWithContext(<Profile />, { user: mockUser });

    // Wait for API calls to resolve.
    await waitFor(() => {
      expect(RannerApi.getUser).toHaveBeenCalled();
      expect(RannerApi.getTripsByUsername).toHaveBeenCalled();
    });

    // Verify loading is done.
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    // Check for no trips message.
    expect(screen.getByText(/no trips found/i)).toBeInTheDocument();
  });
});