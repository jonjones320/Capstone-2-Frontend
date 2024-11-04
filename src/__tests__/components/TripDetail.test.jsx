import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithContext } from '../utils/testUtils';
import { mockUser, mockTrip, mockFlight } from '../helpers/testData';
import AuthContext from '../../context/AuthContext';
import TripDetail from '../../components/TripDetail';
import RannerApi from '../../../api';

const mockNavigate = jest.fn();

// Mock router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => mockNavigate
}));

describe('TripDetail', () => {
  const mockAuthContext = {
    currentUser: mockUser,
    login: jest.fn(),
    logout: jest.fn()
  };

  const renderTripDetail = (user = mockUser) => {
    const contextValue = {
      ...mockAuthContext,
      currentUser: user
    };
    return renderWithContext(
      <AuthContext.Provider value={ contextValue }>
        <TripDetail />
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Setup default mock responses.
    RannerApi.getTripById.mockResolvedValue(mockTrip);
    RannerApi.getFlightsByTrip.mockResolvedValue([mockFlight]);
  });

  test('renders trip and flight details after loading', async () => {
    renderTripDetail();

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(screen.getByText(mockTrip.name)).toBeInTheDocument();
      expect(screen.getByText(`Origin: ${mockTrip.origin}`)).toBeInTheDocument();
      expect(screen.getByText(`Destination: ${mockTrip.destination}`)).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /flights/i })).toBeInTheDocument();
      expect(screen.getByText(/sfo ↔ jfk/i)).toBeInTheDocument();
    });
  });

  test('handles edit mode toggle and update', async () => {
    const updatedTrip = { ...mockTrip, name: 'Updated Trip Name' };
    RannerApi.updateTrip.mockResolvedValueOnce(updatedTrip);
    RannerApi.getTripById.mockResolvedValueOnce(updatedTrip);

    renderTripDetail();

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /trip name/i })).toBeInTheDocument();
    });

    fireEvent.change(screen.getByRole('textbox', { name: /trip name/i }), {
      target: { value: 'Updated Trip Name' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /update trip/i }));

    await waitFor(() => {
      expect(screen.getByText('Updated Trip Name')).toBeInTheDocument();
    });
  });

  test('handles trip deletion', async () => {
    renderTripDetail();

    // Wait for loading to complete.
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /delete trip/i }));

    await waitFor(() => {
      expect(RannerApi.deleteTrip).toHaveBeenCalledWith('1', mockUser.username);
      expect(mockNavigate).toHaveBeenCalledWith('/trips');
    });
  });

  test('handles API errors', async () => {
    const errorMessage = 'Failed to load trip';
    RannerApi.getTripById.mockRejectedValueOnce(new Error(errorMessage));
  
    renderTripDetail();
  
    // Verify error message is shown and loading is not.
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });
  
  test('handles no flights case', async () => {
    RannerApi.getTripById.mockResolvedValueOnce(mockTrip);
    RannerApi.getFlightsByTrip.mockResolvedValueOnce([]);
  
    renderTripDetail();
  
    // Verify Add Flight button is shown instead of Change Flights.
    await waitFor(() => {
      expect(screen.getByText(/no flights booked/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add flight/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /change flights/i })).not.toBeInTheDocument();
    });
  });
});