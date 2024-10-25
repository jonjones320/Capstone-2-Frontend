import { screen, fireEvent, waitFor } from '@testing-library/react';
import Destination from '../components/Destination';
import { renderWithContext } from './setup';
import RannerApi from '../../api';

const mockState = {
  origin: 'SFO'
};

// Use actual 'react-router-dom' hook `useLocation`.
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ state: mockState })
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

  test('fetches airport suggestions', async () => {
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

  test('handles navigation back to origin', () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate')
      .mockImplementation(() => mockNavigate);

    renderWithContext(<Destination />);

    fireEvent.click(screen.getByRole('button', { name: /back/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/origin', {
      state: { origin: mockState.origin }
    });
  });

  test('handles navigation to dates page', () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate')
      .mockImplementation(() => mockNavigate);

    renderWithContext(<Destination />);

    // Select a destination.
    fireEvent.change(screen.getByPlaceholderText(/enter city or airport/i), {
      target: { value: 'JFK' }
    });

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

    await waitFor(() => {
      expect(screen.getByRole('alert'))
        .toHaveTextContent(/please select a destination/i);
    });
  });

  test('handles API errors', async () => {
    RannerApi.getAirportSuggestions.mockRejectedValueOnce(new Error('API Error'));

    renderWithContext(<Destination />);

    fireEvent.change(screen.getByPlaceholderText(/enter city or airport/i), {
      target: { value: 'New' }
    });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/api error/i);
    });
  });
});