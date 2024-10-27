import { screen, fireEvent } from '@testing-library/react';
import { renderWithContext, findAlertMessage } from '../utils/testUtils';
import Destination from '../../components/Destination';
import RannerApi from '../../../api';

const mockState = { origin: 'SFO' };

// Mock router with state.
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ state: mockState }),
  useNavigate: () => jest.fn()
}));

describe('Destination', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders destination search form', () => {
    renderWithContext(<Destination />);
    
    // Use semantic roles for form elements.
    expect(screen.getByRole('combobox', { 
      name: /enter city or airport/i 
    })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });

  test('fetches airport suggestions', async () => {
    const suggestions = [
      { id: 1, iataCode: 'JFK', name: 'John F. Kennedy Airport' }
    ];
    RannerApi.getAirportSuggestions.mockResolvedValueOnce(suggestions);

    renderWithContext(<Destination />);

    // Use combobox role for autocomplete input.
    const searchInput = screen.getByRole('combobox', { 
      name: /enter city or airport/i 
    });
    fireEvent.change(searchInput, { target: { value: 'New' } });

    // Wait for suggestions to appear.
    const suggestion = await screen.findByRole('option', { 
      name: /john f. kennedy airport/i 
    });
    expect(suggestion).toBeInTheDocument();
  });

  test('handles navigation', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate')
      .mockImplementation(() => mockNavigate);

    renderWithContext(<Destination />);

    // Test back navigation.
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/origin', {
      state: { origin: mockState.origin }
    });

    // Test forward navigation.
    const searchInput = screen.getByRole('combobox', { name: /enter city or airport/i });
    fireEvent.change(searchInput, { target: { value: 'JFK' } });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/dates', {
      state: expect.objectContaining({
        origin: mockState.origin,
        destination: 'JFK'
      })
    });
  });

  test('validates destination selection', async () => {
    renderWithContext(<Destination />);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    
    // Use custom alert helper.
    expect(await findAlertMessage(/please select a destination/i)).toBe(true);
  });

  test('handles API errors', async () => {
    RannerApi.getAirportSuggestions.mockRejectedValueOnce(new Error('API Error'));
    
    renderWithContext(<Destination />);
    
    const searchInput = screen.getByRole('combobox', { name: /enter city or airport/i });
    fireEvent.change(searchInput, { target: { value: 'New' } });

    // Use custom alert helper.
    expect(await findAlertMessage(/api error/i)).toBe(true);
  });
});