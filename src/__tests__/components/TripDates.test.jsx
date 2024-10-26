import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithContext } from '../testUtils';
import { mockUser, mockTrip } from '../setup.cjs';
import TripDates from '../../components/TripDates';
import RannerApi from '../../api';

// Mock router state.
const mockLocation = {
  state: {
    origin: 'SFO',
    destination: 'JFK'
  }
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => mockLocation,
  useNavigate: () => jest.fn()
}));

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
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate')
      .mockImplementation(() => mockNavigate);

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

  test('navigates back to destination page', () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate')
      .mockImplementation(() => mockNavigate);

    renderWithContext(<TripDates />, { user: mockUser });

    fireEvent.click(screen.getByRole('button', { name: /back/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/destination', {
      state: mockLocation.state
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
});