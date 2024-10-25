
// src/__tests__/components/Profile.test.jsx
import { screen, fireEvent, waitFor } from '@testing-library/react';
import Profile from '../../components/Profile';
import { renderWithContext, mockUser, mockTrip } from '../setup';
import RannerApi from '../../../api';

describe('Profile', () => {
  beforeEach(() => {
    RannerApi.getUser.mockResolvedValue(mockUser);
    RannerApi.getTripsByUsername.mockResolvedValue([mockTrip]);
  });

  test('renders user information', async () => {
    renderWithContext(<Profile />, { user: mockUser });
    
    await waitFor(() => {
      expect(screen.getByText(mockUser.username)).toBeInTheDocument();
      expect(screen.getByText(`${mockUser.firstName} ${mockUser.lastName}`)).toBeInTheDocument();
    });
  });

  test('handles edit mode', async () => {
    renderWithContext(<Profile />, { user: mockUser });
    
    await waitFor(() => {
      fireEvent.click(screen.getByText(/Edit Profile/i));
    });
    
    expect(screen.getByLabelText(/First Name:/i)).toHaveValue(mockUser.firstName);
    expect(screen.getByLabelText(/Last Name:/i)).toHaveValue(mockUser.lastName);
  });
});