import { screen, fireEvent, act } from '@testing-library/react';
import { renderWithContext } from '../utils/testUtils';
import { findAlertMessage } from '../utils/testUtils';
import Destination from '../../components/Destination';
import RannerApi from '../../../api';

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

  test('fetches airport suggestions', async () => {
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
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
    });
    
    await findAlertMessage(/please select a destination/i);
  });

  test('handles API errors', async () => {
    RannerApi.getAirportSuggestions.mockRejectedValueOnce(new Error('API Error'));
    
    renderWithContext(<Destination />);
    
    const searchInput = screen.getByRole('textbox', { 
      name: /enter city or airport/i 
    });
  
    await act(async () => {
      fireEvent.change(searchInput, { 
        target: { value: 'New' } 
      });
    });
  
    expect(await findAlertMessage(/api error/i)).toBe(true);
  });
});