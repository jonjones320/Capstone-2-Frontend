import { screen, waitFor } from '@testing-library/react';
import { renderWithContext } from '../testUtils';
import { mockTrip, mockFlight } from '../setup.cjs';
import FlightList from '../../components/FlightList';
import RannerApi from '../../../api';

describe('FlightList', () => {
  beforeEach(() => {
    RannerApi.searchFlightOffers.mockResolvedValue({ data: [mockFlight] });
  });

  test('renders loading state initially', () => {
    renderWithContext(<FlightList />, {
      route: '/flights',
      state: { trip: mockTrip },
    });
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders flights after loading', async () => {
    renderWithContext(<FlightList />, {
      route: '/flights',
      state: { trip: mockTrip },
    });
    
    await waitFor(() => {
      // Look for flight card heading
      expect(screen.getByRole('heading', { 
        name: new RegExp(`${mockFlight.itineraries[0].segments[0].departure.iataCode}.*${mockFlight.itineraries[0].segments[0].arrival.iataCode}`, 'i')
      })).toBeInTheDocument();
    });
  });

  test('handles error state', async () => {
    RannerApi.searchFlightOffers.mockRejectedValue(new Error('API Error'));
    
    renderWithContext(<FlightList />, {
      route: '/flights',
      state: { trip: mockTrip },
    });
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/unable to fetch flights/i);
    });
  });

  test('shows no flights message when empty', async () => {
    RannerApi.searchFlightOffers.mockResolvedValue({ data: [] });
    
    renderWithContext(<FlightList />, {
      route: '/flights',
      state: { trip: mockTrip },
    });
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/no flights found/i);
    });
  });
});