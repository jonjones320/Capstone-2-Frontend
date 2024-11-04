import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithContext } from '../utils/testUtils';
import { mockUser, mockTrip } from '../helpers/testData';
import TripForm from '../../components/TripForm';
import RannerApi from '../../../api';

describe('TripForm', () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders empty form without initial data', () => {
    renderWithContext(<TripForm onSubmit={mockSubmit} />);
    
    expect(screen.getByLabelText(/Trip Name:/i)).toHaveValue('');
    expect(screen.getByLabelText(/Origin:/i)).toHaveValue('');
    expect(screen.getByLabelText(/Destination:/i)).toHaveValue('');
  });

  test('renders form with initial data', () => {
    renderWithContext(<TripForm initialData={mockTrip} onSubmit={mockSubmit} />);
    
    expect(screen.getByLabelText(/Trip Name:/i)).toHaveValue(mockTrip.name);
    expect(screen.getByLabelText(/Origin:/i)).toHaveValue(mockTrip.origin);
    expect(screen.getByLabelText(/Destination:/i)).toHaveValue(mockTrip.destination);
  });

  test('handles airport suggestions', async () => {
    const suggestions = [
      { id: 1, iataCode: 'JFK', name: 'John F. Kennedy Airport' }
    ];
    RannerApi.getAirportSuggestions.mockResolvedValueOnce(suggestions);
    
    renderWithContext(<TripForm onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/Origin:/i), {
      target: { name: 'origin', value: 'New' }
    });

    await waitFor(() => {
      expect(RannerApi.getAirportSuggestions).toHaveBeenCalledWith('New');
      expect(screen.getByText('John F. Kennedy Airport (JFK)')).toBeInTheDocument();
    });
  });

  test('validates form before submission', async () => {
    renderWithContext(<TripForm onSubmit={mockSubmit} />, { user: mockUser });
  
    // Fill out form partially to test name validation.
    fireEvent.change(screen.getByLabelText(/Trip Name:/i), {
      target: { name: 'name', value: '' }
    });
  
    // Use form submission instead of button click.
    fireEvent.submit(screen.getByRole('form'));
  
    // Wait specifically for the Alert with the validation message.
    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('alert-danger');
      expect(alert).toHaveTextContent('Trip name is required');
    });
  
    // Verify the submit handler wasn't called.
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  test('handles successful form submission', async () => {
    renderWithContext(<TripForm onSubmit={mockSubmit} />);
    
    // Fill required fields.
    fireEvent.change(screen.getByLabelText(/Trip Name:/i), {
      target: { name: 'name', value: mockTrip.name }
    });
    fireEvent.change(screen.getByLabelText(/Origin:/i), {
      target: { name: 'origin', value: mockTrip.origin }
    });
    fireEvent.change(screen.getByLabelText(/Destination:/i), {
      target: { name: 'destination', value: mockTrip.destination }
    });
    fireEvent.change(screen.getByLabelText(/Departure Date:/i), {
      target: { name: 'startDate', value: mockTrip.startDate }
    });
    fireEvent.change(screen.getByLabelText(/Return Date:/i), {
      target: { name: 'endDate', value: mockTrip.endDate }
    });

    fireEvent.submit(screen.getByRole('button', { name: /Create Trip/i }));
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({
        name: mockTrip.name,
        origin: mockTrip.origin,
        destination: mockTrip.destination
      }));
    });
  });

  test('handles API errors gracefully', async () => {
    RannerApi.getAirportSuggestions.mockRejectedValueOnce(new Error('API Error'));
    
    renderWithContext(<TripForm onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/Origin:/i), {
      target: { name: 'origin', value: 'New' }
    });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Failed to load suggestions');
    });
  });
});