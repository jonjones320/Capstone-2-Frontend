import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithContext } from '../utils/testUtils';
import { mockUser, mockTrip, mockFlight } from '../helpers/testData';
import TripDetail from '../../components/TripDetail';
import RannerApi from '../../../api';

// Mock router.
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => mockNavigate
}));

describe('TripDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Setup default mock responses.
    RannerApi.getTripById.mockResolvedValue(mockTrip);
    RannerApi.getFlightsByTrip.mockResolvedValue([mockFlight]);
  });

  test('renders trip and flight details after loading', async () => {
    renderWithContext(<TripDetail />, { user: mockUser });
    
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(screen.getByText(mockTrip.name)).toBeInTheDocument();
      expect(screen.getByText(`Origin: ${mockTrip.origin}`)).toBeInTheDocument();
      expect(screen.getByText(`Destination: ${mockTrip.destination}`)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /edit trip/i })).toBeInTheDocument();
    });
  });

  test('handles edit mode toggle', async () => {
    renderWithContext(<TripDetail />, { user: mockUser });

    // Wait for component to fully render.
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(screen.getByText(mockTrip.name)).toBeInTheDocument();
    });

    // Click edit button.
    fireEvent.click(screen.getByRole('button', { name: /edit trip/i }));

    // Verify we've switched to edit mode.
    await waitFor(() => {
      expect(screen.getByRole('form')).toBeInTheDocument();
      expect(screen.getByLabelText(/Trip Name:/i)).toBeInTheDocument();
    });
  });

  test('handles trip deletion', async () => {
    renderWithContext(<TripDetail />, { user: mockUser });

    // Wait for initial load.
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Find and click delete button.
    const deleteButton = await screen.findByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    // Verify deletion and navigation.
    await waitFor(() => {
      expect(RannerApi.deleteTrip).toHaveBeenCalledWith('1', mockUser.username);
      expect(mockNavigate).toHaveBeenCalledWith('/trips');
    });
  });

  test('handles API errors', async () => {
    const errorMessage = 'Trip not found';
    RannerApi.getTripById.mockRejectedValueOnce(new Error(errorMessage));
  
    renderWithContext(<TripDetail />, { user: mockUser });
  
    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(errorMessage);
    });
  });
  
  test('handles no flights case', async () => {
    RannerApi.getFlightsByTrip.mockResolvedValueOnce([]);
  
    renderWithContext(<TripDetail />, { user: mockUser });
  
    await waitFor(() => {
      expect(screen.getByText(/no flights booked/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add flight/i })).toBeInTheDocument();
    });
  });
});