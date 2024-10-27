import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithContext } from '../utils/testUtils';
import { mockUser, mockTrip, mockFlight } from '../helpers/testData';
import AuthContext from '../../context/AuthContext';
import TripDetail from '../../components/TripDetail';
import RannerApi from '../../../api';

// Mock router.
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => jest.fn()
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

  test('renders loading state initially', () => {
    renderTripDetail();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders trip and flight details after loading', async () => {
    renderTripDetail();

    await waitFor(() => {
      // Trip details.
      expect(screen.getByText(mockTrip.name)).toBeInTheDocument();
      expect(screen.getByText(`Origin: ${mockTrip.origin}`)).toBeInTheDocument();
      expect(screen.getByText(`Destination: ${mockTrip.destination}`)).toBeInTheDocument();
      
      // Flight section.
      expect(screen.getByRole('heading', { name: /flights/i })).toBeInTheDocument();
      expect(screen.getByText(/sfo ↔ jfk/i)).toBeInTheDocument();
    });
  });

  test('shows edit/delete buttons when user is authenticated', async () => {
    renderTripDetail();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /delete trip/i })).toBeInTheDocument();
    });
  });

  test('hides edit/delete buttons when user is not authenticated', async () => {
    renderTripDetail(null); // Pass null as currentUser.

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /delete trip/i })).not.toBeInTheDocument();
    });
  });

  test('handles edit mode toggle', async () => {
    renderTripDetail();

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    });

    expect(screen.getByRole('textbox', { name: /trip name/i })).toHaveValue(mockTrip.name);
  });

  test('handles trip update', async () => {
    const updatedTrip = { ...mockTrip, name: 'Updated Trip Name' };
    RannerApi.updateTrip.mockResolvedValueOnce(updatedTrip);
    RannerApi.getTripById.mockResolvedValueOnce(updatedTrip);

    renderTripDetail();

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /edit/i }));
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
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate')
      .mockImplementation(() => mockNavigate);

    renderTripDetail();

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /delete trip/i }));
    });

    await waitFor(() => {
      expect(RannerApi.deleteTrip).toHaveBeenCalledWith('1', mockUser.username);
      expect(mockNavigate).toHaveBeenCalledWith('/trips');
    });
  });

  test('handles flight removal', async () => {
    // Mock successful flight deletion.
    RannerApi.deleteFlight.mockResolvedValueOnce();
    renderTripDetail();
  
    // Wait for component to load and find remove button.
    const removeButton = await screen.findByRole('button', { name: /remove flight/i });
    
    // Click remove button.
    fireEvent.click(removeButton);
  
    await waitFor(() => {
      // Verify API was called correctly.
      expect(RannerApi.deleteFlight).toHaveBeenCalledWith(
        mockFlight.id,
        mockUser.username
      );
      // Verify flight was removed from display.
      expect(screen.queryByText(/sfo ↔ jfk/i)).not.toBeInTheDocument();
    });
  });
  
  test('handles API errors', async () => {
    const errorMessage = 'Failed to load trip';
    RannerApi.getTripById.mockRejectedValueOnce(new Error(errorMessage));
  
    renderTripDetail();
  
    // Wait for error to display.
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(errorMessage);
    
    // Verify loading state is removed.
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
  
  test('handles no flights case', async () => {
    RannerApi.getTripById.mockResolvedValueOnce(mockTrip);
    RannerApi.getFlightsByTrip.mockResolvedValueOnce([]);
  
    renderTripDetail();
  
    // Wait for no flights message.
    await screen.findByText(/no flights booked/i);
    
    // Verify Add Flight button is shown instead of Change Flights.
    expect(screen.getByRole('button', { name: /add flight/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /change flights/i })).not.toBeInTheDocument();
  });
});