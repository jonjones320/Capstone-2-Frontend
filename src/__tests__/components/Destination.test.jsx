import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithContext } from '../utils/testUtils';
import { findAlertMessage } from '../utils/testUtils';
import Destination from '../../components/Destination';
import RannerApi from '../../../api';

// Mock router hooks.
const mockNavigate = jest.fn();
const mockLocation = { state: { origin: 'SFO' } };

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation
}));

describe('Destination', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders destination search form', () => {
    renderWithContext(<Destination />);
    
    expect(screen.getByPlaceholderText(/enter city or airport/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });

  test('handles airport suggestions', async () => {
    const suggestions = [
      { id: 1, iataCode: 'JFK', name: 'John F. Kennedy Airport' }
    ];
    RannerApi.getAirportSuggestions.mockResolvedValueOnce(suggestions);

    renderWithContext(<Destination />);

    fireEvent.change(screen.getByPlaceholderText(/enter city or airport/i), {
      target: { value: 'New' }
    });

    await waitFor(() => {
      expect(screen.getByText(/john f. kennedy airport/i)).toBeInTheDocument();
    });
  });

  test('handles API errors', async () => {
    RannerApi.getAirportSuggestions.mockRejectedValueOnce(new Error('API Error'));
    
    renderWithContext(<Destination />);
    
    fireEvent.change(screen.getByPlaceholderText(/enter city or airport/i), {
      target: { value: 'New' }
    });
    
    await waitFor(async () => {
      const alertText = await findAlertMessage('API Error');
      expect(alertText).toBe(true);
    });
  });

  test('validates destination selection', async () => {
    renderWithContext(<Destination />);
    
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    
    await waitFor(async () => {
      const alertText = await findAlertMessage('Please select a destination');
      expect(alertText).toBe(true);
    });
  });

  test('navigates correctly with valid destination', async () => {
    const destination = 'JFK';
    
    renderWithContext(<Destination />);
    
    fireEvent.change(screen.getByPlaceholderText(/enter city or airport/i), {
      target: { value: destination }
    });

    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dates', {
        state: { origin: 'SFO', destination }
      });
    });
  });

  test('handles missing origin state', () => {
    // Temporarily override the mock location to simulate missing state.
    jest.spyOn(require('react-router-dom'), 'useLocation')
      .mockImplementationOnce(() => ({ state: null }));

    renderWithContext(<Destination />);
    
    expect(mockNavigate).toHaveBeenCalledWith('/origin');
  });
});