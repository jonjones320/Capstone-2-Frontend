import { screen, waitFor } from '@testing-library/react';
import { renderWithContext, mockFlight } from '../setup';
import FlightList from '../../components/FlightList';
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
