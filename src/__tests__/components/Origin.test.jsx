import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithContext } from '../testUtils';
import Origin from '../../components/Origin';
import RannerApi from '../../../api';

describe('Origin', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders origin search form', () => {
    renderWithContext(<Origin />);
    
    expect(screen.getByPlaceholderText(/enter city or airport/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });

  test('handles airport suggestions', async () => {
    const suggestions = [
      { id: 1, iataCode: 'JFK', name: 'John F. Kennedy Airport' },
      { id: 2, iataCode: 'LGA', name: 'LaGuardia Airport' }
    ];
    RannerApi.getAirportSuggestions.mockResolvedValueOnce(suggestions);

    renderWithContext(<Origin />);

    const input = screen.getByPlaceholderText(/enter city or airport/i);
    fireEvent.change(input, { target: { value: 'New' } });

    await waitFor(() => {
      expect(RannerApi.getAirportSuggestions).toHaveBeenCalledWith('New');
      expect(screen.getByText(/john f. kennedy airport/i)).toBeInTheDocument();
      expect(screen.getByText(/laguardia airport/i)).toBeInTheDocument();
    });
  });

  test('handles suggestion selection', async () => {
    const suggestions = [
      { id: 1, iataCode: 'JFK', name: 'John F. Kennedy Airport' }
    ];
    RannerApi.getAirportSuggestions.mockResolvedValueOnce(suggestions);

    renderWithContext(<Origin />);

    const input = screen.getByPlaceholderText(/enter city or airport/i);
    fireEvent.change(input, { target: { value: 'New' } });

    await waitFor(() => {
      fireEvent.click(screen.getByText(/john f. kennedy airport/i));
    });

    expect(input).toHaveValue('JFK');
  });

  test('validates origin selection before navigation', async () => {
    renderWithContext(<Origin />);

    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert'))
        .toHaveTextContent(/please select a starting location/i);
    });
  });

  test('handles API errors gracefully', async () => {
    RannerApi.getAirportSuggestions.mockRejectedValueOnce(new Error('API Error'));

    renderWithContext(<Origin />);

    fireEvent.change(screen.getByPlaceholderText(/enter city or airport/i), {
      target: { value: 'New' }
    });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/api error/i);
    });
  });
});