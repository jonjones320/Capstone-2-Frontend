import { screen, waitFor, act } from '@testing-library/react';
import { renderWithContext } from '../utils/testUtils.jsx';
import { mockTrip, mockFlight } from '../helpers/testData.js';
import FlightList from '../../components/FlightList';
import RannerApi from '../../../api';

// Mock the useLocation hook
const mockUseLocation = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => mockUseLocation()
}));

describe('FlightList', () => {
  beforeEach(() => {
    // Reset all mocks.
    jest.clearAllMocks();
    // Setup default location state.
    mockUseLocation.mockReturnValue({ state: { trip: mockTrip } });
    // Setup default API response.
    RannerApi.searchFlightOffers.mockResolvedValue({ data: [mockFlight] });
  });

  test('renders loading state initially', async () => {
    await act(async () => {
      renderWithContext(<FlightList />);
    });
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders flights after loading', async () => {
    await act(async () => {
      renderWithContext(<FlightList />);
    });
    
    // Use waitFor for async state updates
    await waitFor(() => {
      expect(screen.getByRole('heading', { 
        name: new RegExp(`${mockFlight.itineraries[0].segments[0].departure.iataCode}.*${mockFlight.itineraries[0].segments[0].arrival.iataCode}`, 'i')
      })).toBeInTheDocument();
    });
  });

  test('handles error state', async () => {
    // Mock Api error.
    RannerApi.searchFlightOffers.mockRejectedValue(new Error('API Error'));
    
    await act(async () => {
      renderWithContext(<FlightList />);
    });
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/unable to fetch flights/i);
    });
  });

  test('shows no flights message when empty', async () => {
    // Mock empty flight list.
    RannerApi.searchFlightOffers.mockResolvedValue({ data: [] });
    
    await act(async () => {
      renderWithContext(<FlightList />);
    });
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/no flights found/i);
    });
  });

  test('handles missing location state', async () => {
    // Mock missing state.
    mockUseLocation.mockReturnValue({ state: null });
    
    await act(async () => {
      renderWithContext(<FlightList />);
    });
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/invalid search parameters/i);
    });
  });
});