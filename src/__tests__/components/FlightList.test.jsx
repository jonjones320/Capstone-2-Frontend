import { screen, waitFor } from '@testing-library/react';
import { renderWithContext } from '../utils/testUtils';
import { mockTrip, mockFlight } from '../helpers/testData';
import FlightList from '../../components/FlightList';
import RannerApi from '../../../api';

// Mock the useLocation hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation
}));

describe('FlightList', () => {
  beforeEach(() => {
    // Reset all mocks.
    jest.clearAllMocks();

    // Setup default API response.
    RannerApi.searchFlightOffers.mockResolvedValue({ data: [mockFlight] });
  });

  test('renders loading state initially', () => {
    renderWithContext(<FlightList />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders flights after loading', async () => {
    renderWithContext(<FlightList />);
    
    // Creates mocked flight header info.
    await waitFor(() => {
      const flightHeader = screen.getByRole('heading', { 
        name: new RegExp(`${mockFlight.itineraries[0].segments[0].departure.iataCode}.*${mockFlight.itineraries[0].segments[0].arrival.iataCode}`, 'i')
      });
      expect(flightHeader).toBeInTheDocument();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  test('handles error state', async () => {
    // Mock API error.
    RannerApi.searchFlightOffers.mockRejectedValueOnce(new Error('Failed to fetch flights'));
    
    renderWithContext(<FlightList />);
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/failed to fetch flights/i);
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  test('shows no flights message when empty', async () => {
    // Mock empty flight response.
    RannerApi.searchFlightOffers.mockResolvedValueOnce({ data: [] });
    
    renderWithContext(<FlightList />);
    
    await waitFor(() => {
      expect(screen.getByText(/no flights found/i)).toBeInTheDocument();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  test('handles missing location state', () => {
    // Override location mock for this test.
    jest.spyOn(require('react-router-dom'), 'useLocation')
      .mockImplementationOnce(() => ({ state: null }));
    
    renderWithContext(<FlightList />);
    
    expect(screen.getByRole('alert')).toHaveTextContent(/invalid search parameters/i);
  });
});