import { screen, fireEvent, act } from '@testing-library/react';
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

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/enter city or airport/i), {
        target: { value: 'New' }
      });
    });

    expect(await screen.findByText(/john f. kennedy airport/i)).toBeInTheDocument();
  });

  test('handles API errors', async () => {
    RannerApi.getAirportSuggestions.mockRejectedValueOnce(new Error('API Error'));
    
    renderWithContext(<Destination />);
    
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/enter city or airport/i), {
        target: { value: 'New' }
      });
    });
    
    expect(await findAlertMessage(/api error/i)).toBe(true);
  });

  test('validates destination selection', async () => {
    renderWithContext(<Destination />);
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
    });
    
    expect(await findAlertMessage(/please select a destination/i)).toBe(true);
  });

  test('navigates correctly with valid destination', async () => {
    const destination = 'JFK';
    
    renderWithContext(<Destination />);
    
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/enter city or airport/i), {
        target: { value: destination }
      });
    });

    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/dates', {
      state: { origin: 'SFO', destination }
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