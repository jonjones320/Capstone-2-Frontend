import { screen, fireEvent, waitFor } from '@testing-library/react';
import { mockUser, mockTrip } from '../helpers/testData';
import { renderWithContext } from '../utils/testUtils';
import Profile from '../../components/Profile';
import RannerApi from '../../../api';

describe('Profile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Setup mock responses
    RannerApi.getUser.mockResolvedValue(mockUser);
    RannerApi.getTripsByUsername.mockResolvedValue([mockTrip]);
  });

  test('renders loading state initially', () => {
    renderWithContext(<Profile />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders user profile and trips after loading', async () => {
    renderWithContext(<Profile />, { user: mockUser });

    await waitFor(() => {
      expect(screen.getByText(mockUser.username)).toBeInTheDocument();
      expect(screen.getByText(mockTrip.name)).toBeInTheDocument();
    });
  });

  test('handles edit mode toggle', async () => {
    renderWithContext(<Profile />, { user: mockUser });

    await waitFor(() => {
      expect(screen.getByText(mockUser.username)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/edit profile/i));
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  test('handles API error', async () => {
    RannerApi.getUser.mockRejectedValueOnce(new Error('Failed to fetch profile'));
    
    renderWithContext(<Profile />, { user: mockUser });

    await waitFor(() => {
      expect(screen.getByRole('alert'))
        .toHaveTextContent(/failed to fetch profile/i);
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

    await waitFor(() => {
      fireEvent.click(screen.getByText(/edit profile/i));
    });

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'Updated' }
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Name' }
    });

    fireEvent.click(screen.getByText(/save changes/i));

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
    RannerApi.getTripsByUsername.mockResolvedValueOnce([]);
    
    renderWithContext(<Profile />, { user: mockUser });

    await waitFor(() => {
      expect(screen.getByText(/no trips found/i)).toBeInTheDocument();
    });
  });
});