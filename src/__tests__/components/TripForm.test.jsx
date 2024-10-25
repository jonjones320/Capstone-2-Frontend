// src/__tests__/components/TripForm.test.jsx
import { screen, fireEvent, waitFor } from '@testing-library/react';
import TripForm from '../../components/TripForm';
import { renderWithContext, mockTrip } from '../setup';
import RannerApi from '../../../api';

describe('TripForm', () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders empty form without initial data', () => {
    renderWithContext(<TripForm onSubmit={mockSubmit} />);
    
    expect(screen.getByLabelText(/Trip Name:/i)).toHaveValue('');
    expect(screen.getByLabelText(/Origin:/i)).toHaveValue('');
    expect(screen.getByLabelText(/Destination:/i)).toHaveValue('');
  });

  test('renders form with initial data', () => {
    renderWithContext(<TripForm initialData={mockTrip} onSubmit={mockSubmit} />);
    
    expect(screen.getByLabelText(/Trip Name:/i)).toHaveValue(mockTrip.name);
    expect(screen.getByLabelText(/Origin:/i)).toHaveValue(mockTrip.origin);
    expect(screen.getByLabelText(/Destination:/i)).toHaveValue(mockTrip.destination);
  });

  test('handles form submission', async () => {
    renderWithContext(<TripForm onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/Trip Name:/i), {
      target: { name: 'name', value: 'New Trip' },
    });
    fireEvent.change(screen.getByLabelText(/Origin:/i), {
      target: { name: 'origin', value: 'LAX' },
    });
    fireEvent.change(screen.getByLabelText(/Destination:/i), {
      target: { name: 'destination', value: 'NYC' },
    });
    
    fireEvent.submit(screen.getByRole('button', { name: /Create Trip/i }));
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
    });
  });
});

// src/__tests__/components/FlightList.test.jsx
import { screen, waitFor } from '@testing-library/react';
import FlightList from '../../components/FlightList';
import { renderWithContext, mockFlight } from '../setup';
import RannerApi from '../../api';

describe('FlightList', () => {
  beforeEach(() => {
    RannerApi.searchFlightOffers.mockResolvedValue({ data: [mockFlight] });
  });

  test('renders loading state initially', () => {
    renderWithContext(<FlightList />, {
      route: '/flights',
      state: { trip: mockTrip },
    });
    
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  test('renders flights after loading', async () => {
    renderWithContext(<FlightList />, {
      route: '/flights',
      state: { trip: mockTrip },
    });
    
    await waitFor(() => {
      expect(screen.getByText(mockFlight.itineraries[0].segments[0].departure.iataCode)).toBeInTheDocument();
    });
  });

  test('handles error state', async () => {
    RannerApi.searchFlightOffers.mockRejectedValue(new Error('API Error'));
    
    renderWithContext(<FlightList />, {
      route: '/flights',
      state: { trip: mockTrip },
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Unable to fetch flights/i)).toBeInTheDocument();
    });
  });
});

// src/__tests__/components/Profile.test.jsx
import { screen, fireEvent, waitFor } from '@testing-library/react';
import Profile from '../../components/Profile';
import { renderWithContext, mockUser, mockTrip } from '../setup';
import RannerApi from '../../api';

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