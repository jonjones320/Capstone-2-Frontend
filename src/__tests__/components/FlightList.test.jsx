import { screen, waitFor } from '@testing-library/react';
import { renderWithContext, waitForLoadingToFinish } from '../utils/testUtils';
import { mockTrip, mockFlight } from '../helpers/testData';
import FlightList from '../../components/FlightList';
import RannerApi from '../../../api';

// Mock router hooks.
const mockNavigate = jest.fn();

// Setup mock location state.
const mockLocation = {
  state: { trip: mockTrip }
};

// Mock react-router-dom.
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation
}));

describe('FlightList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    RannerApi.searchFlightOffers.mockResolvedValue({ data: [mockFlight] });
  });

  test('renders loading state initially', async () => {
    renderWithContext(<FlightList />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders flights after loading', async () => {
    renderWithContext(<FlightList />);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { 
        name: new RegExp(`${mockFlight.itineraries[0].segments[0].departure.iataCode}.*${mockFlight.itineraries[0].segments[0].arrival.iataCode}`, 'i')
      })).toBeInTheDocument();
    });
  });

  test('handles error state', async () => {
    RannerApi.searchFlightOffers.mockRejectedValueOnce(new Error('Failed to fetch flights'));
    renderWithContext(<FlightList />);
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/failed to load flights/i);
    });
  });

  test('shows no flights message when empty', async () => {
    RannerApi.searchFlightOffers.mockResolvedValueOnce({ data: [] });
    renderWithContext(<FlightList />);
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/no flights found/i);
    });
  });

  test('handles missing location state', async () => {
    // Mock API to do nothing.
    RannerApi.searchFlightOffers.mockImplementationOnce(() => 
      new Promise((resolve) => setTimeout(resolve, 0))
    );
    
    // Override useLocation for this test only.
    jest.spyOn(require('react-router-dom'), 'useLocation')
      .mockReturnValue({ state: null });
    
    waitFor(async () => {
      renderWithContext(<FlightList />);
    });
  
    waitFor(async () => {
      await waitForLoadingToFinish();
    });
  
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Trip information is missing');
  });
});