import { screen, fireEvent, waitFor } from '@testing-library/react';
import { mockUser, mockTrip } from '../helpers/testData';
import { renderWithContext } from '../utils/testUtils';
import Profile from '../../components/Profile';
import RannerApi from '../../../api';

describe('Profile', () => {
  beforeEach(() => {
    // Set up the specific mocked API response for Profile component.
    RannerApi.getUser.mockResolvedValue(mockUser);
    RannerApi.getTripsByUsername.mockResolvedValue([mockTrip]);
  });

  test('renders loading state initially', () => {
    renderWithContext(<Profile />, { user: mockUser });
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders user profile and trips after loading', async () => {
    renderWithContext(<Profile />, { user: mockUser });

    // Wait for loading spinner to disappear first.
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Then check for content.
    await waitFor(() => {
      expect(screen.getByText(mockUser.username)).toBeInTheDocument();
      expect(screen.getByText(mockTrip.name)).toBeInTheDocument();
    });
  });

  test('handles edit mode toggle', async () => {
    renderWithContext(<Profile />, { user: mockUser });

    // Wait for loading to finish.
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Click edit button and verify form appears.
    fireEvent.click(screen.getByText(/edit profile/i));

    await waitFor(() => {
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });
  });

  test('handles API error', async () => {
    // Mock API error.
    RannerApi.getUser.mockRejectedValueOnce(new Error('Failed to fetch profile'));
    RannerApi.getTripsByUsername.mockRejectedValueOnce(new Error('Failed to fetch profile'));

    renderWithContext(<Profile />, { user: mockUser });

    // Wait for loading to finish and error to appear.
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent(/failed to fetch profile/i);
    });
  });

  test('updates profile successfully', async () => {
    const updatedUser = {
      ...mockUser,
      firstName: 'Updated',
      lastName: 'Name'
    };

    RannerApi.patchUser.mockResolvedValueOnce(updatedUser);
    
    renderWithContext(<Profile />, { user: mockUser });

    // Wait for loading to finish.
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

    // Wait for loading to finish.
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Check for no trips message.
    await waitFor(() => {
      expect(screen.getByText(/no trips found/i)).toBeInTheDocument();
    });
  });
});