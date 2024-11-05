import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithContext } from '../utils/testUtils';
import { mockUser, mockTrip } from '../helpers/testData';
import TripDates from '../../components/TripDates';
import RannerApi from '../../../api';

// Mock router hooks with a complete state.
const mockNavigate = jest.fn();
const mockLocation = {
  state: {
    origin: 'SFO',
    destination: 'JFK'
  }
};

// Initialize mocked states.
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => mockLocation,
  useNavigate: () => mockNavigate
}));

// Mocks autofill suggestions hook.
jest.mock('../../components/helpers/useAirportSearch', () => ({
  useAirportSearch: () => ({
    searchTerm: '',
    suggestions: [],
    isLoading: false,
    error: null,
    handleChange: jest.fn(),
    handleSuggestionClick: jest.fn(),
    clearSearch: jest.fn(),
    setError: jest.fn()
  })
}));

// Main tests. 
describe('TripDates', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    RannerApi.postTrip.mockResolvedValue({ trip: mockTrip });
  });

  test('renders trip creation form', () => {
    renderWithContext(<TripDates />, { user: mockUser });

    expect(screen.getByText(/create your trip/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/trip name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/departure date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/return date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/passengers/i)).toBeInTheDocument();
  });

  test('handles successful trip creation', async () => {
    renderWithContext(<TripDates />, { user: mockUser });

    // Fill out form.
    fireEvent.change(screen.getByLabelText(/trip name/i), {
      target: { value: mockTrip.name }
    });
    fireEvent.change(screen.getByLabelText(/departure date/i), {
      target: { value: mockTrip.startDate }
    });
    fireEvent.change(screen.getByLabelText(/return date/i), {
      target: { value: mockTrip.endDate }
    });
    fireEvent.change(screen.getByLabelText(/passengers/i), {
      target: { value: mockTrip.passengers }
    });

    fireEvent.submit(screen.getByRole('button', { name: /create trip/i }));

    await waitFor(() => {
      expect(RannerApi.postTrip).toHaveBeenCalledWith(
        expect.objectContaining({
          name: mockTrip.name,
          origin: mockLocation.state.origin,
          destination: mockLocation.state.destination,
          startDate: mockTrip.startDate,
          endDate: mockTrip.endDate,
          passengers: mockTrip.passengers,
          username: mockUser.username
        })
      );
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/flights", {
        state: { trip: mockTrip }
      });
    });
  });

  test('handles API error during trip creation', async () => {
    RannerApi.postTrip.mockRejectedValueOnce(new Error('Failed to create trip'));

    renderWithContext(<TripDates />, { user: mockUser });

    // Fill out form.
    fireEvent.change(screen.getByLabelText(/trip name/i), {
      target: { value: mockTrip.name }
    });
    fireEvent.submit(screen.getByRole('button', { name: /create trip/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert'))
        .toHaveTextContent(/failed to create trip/i);
    });
  });

  test('validates date range', async () => {
    renderWithContext(<TripDates />, { user: mockUser });

    // Set invalid date range.
    fireEvent.change(screen.getByLabelText(/departure date/i), {
      target: { value: '2024-12-10' }
    });
    fireEvent.change(screen.getByLabelText(/return date/i), {
      target: { value: '2024-12-01' }
    });

    fireEvent.submit(screen.getByRole('button', { name: /create trip/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert'))
        .toHaveTextContent(/start date cannot be after end date/i);
    });
  });

  test('handles missing location state', () => {
    // Override location mock for this test
    jest.spyOn(require('react-router-dom'), 'useLocation')
      .mockImplementationOnce(() => ({ state: null }));

    renderWithContext(<TripDates />, { user: mockUser });
    
    expect(mockNavigate).toHaveBeenCalledWith('/origin');
  });
});