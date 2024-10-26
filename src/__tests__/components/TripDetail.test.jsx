import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithContext } from '../utils/testUtils';
import { mockUser, mockTrip, mockFlight } from '../helpers/testData';
import TripDetail from '../../components/TripDetail';
import RannerApi from '../../../api';

// Tell jest to not mock react-router-dom's `useParams` for the id.
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' })
}));

describe('TripDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Setup default mock responses.
    RannerApi.getTripById.mockResolvedValue(mockTrip);
    RannerApi.getFlightsByTrip.mockResolvedValue([mockFlight]);
  });

  test('renders loading state initially', () => {
    renderWithContext(<TripDetail />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders trip and flight details after loading', async () => {
    renderWithContext(<TripDetail />, { user: mockUser });

    await waitFor(() => {
      // Trip details.
      expect(screen.getByText(mockTrip.name)).toBeInTheDocument();
      expect(screen.getByText(`Origin: ${mockTrip.origin}`)).toBeInTheDocument();
      expect(screen.getByText(`Destination: ${mockTrip.destination}`)).toBeInTheDocument();
      
      // Flight section.
      expect(screen.getByText(/flights/i)).toBeInTheDocument();
      expect(screen.getByText(/sfo ↔ jfk/i)).toBeInTheDocument();
    });
  });

  test('handles edit mode toggle', async () => {
    renderWithContext(<TripDetail />, { user: mockUser });

    await waitFor(() => {
      expect(screen.getByText(mockTrip.name)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(screen.getByLabelText(/trip name/i)).toHaveValue(mockTrip.name);
  });

  test('handles trip update', async () => {
    const updatedTrip = { ...mockTrip, name: 'Updated Trip Name' };
    RannerApi.updateTrip.mockResolvedValueOnce(updatedTrip);
    RannerApi.getTripById.mockResolvedValueOnce(updatedTrip);

    renderWithContext(<TripDetail />, { user: mockUser });

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    });

    fireEvent.change(screen.getByLabelText(/trip name/i), {
      target: { value: 'Updated Trip Name' }
    });
    fireEvent.click(screen.getByRole('button', { name: /update trip/i }));

    await waitFor(() => {
      expect(screen.getByText('Updated Trip Name')).toBeInTheDocument();
    });
  });

  test('handles trip deletion', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate')
      .mockImplementation(() => mockNavigate);

    renderWithContext(<TripDetail />, { user: mockUser });

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    });

    await waitFor(() => {
      expect(RannerApi.deleteTrip).toHaveBeenCalledWith('1', mockUser.username);
      expect(mockNavigate).toHaveBeenCalledWith('/trips');
    });
  });

  test('handles flight removal', async () => {
    renderWithContext(<TripDetail />, { user: mockUser });

    await waitFor(() => {
      const removeButton = screen.getByRole('button', { name: /remove flight/i });
      fireEvent.click(removeButton);
    });

    await waitFor(() => {
      expect(screen.queryByText(/sfo ↔ jfk/i)).not.toBeInTheDocument();
    });
  });

  test('handles API errors', async () => {
    RannerApi.getTripById.mockRejectedValueOnce(new Error('Failed to load trip'));

    renderWithContext(<TripDetail />, { user: mockUser });

    await waitFor(() => {
      expect(screen.getByRole('alert'))
        .toHaveTextContent(/failed to load trip/i);
    });
  });

  test('handles no flights case', async () => {
    RannerApi.getFlightsByTrip.mockResolvedValueOnce([]);

    renderWithContext(<TripDetail />, { user: mockUser });

    await waitFor(() => {
      expect(screen.getByText(/no flights booked/i)).toBeInTheDocument();
    });
  });
});