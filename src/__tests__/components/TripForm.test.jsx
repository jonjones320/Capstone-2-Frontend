import { screen, fireEvent, waitFor } from '@testing-library/react';
import TripForm from '../../components/TripForm';
import { renderWithContext, mockTrip } from '../setup';
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

  test('handles form submission', async () => {
    renderWithContext(<TripForm onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/Trip Name:/i), {
      target: { name: 'name', value: 'New Trip' },
    });
    fireEvent.change(screen.getByLabelText(/Origin:/i), {
      target: { name: 'origin', value: 'LAX' },
    });
    fireEvent.change(screen.getByLabelText(/Destination:/i), {
      target: { name: 'destination', value: 'NYC' },
    });
    
    fireEvent.submit(screen.getByRole('button', { name: /Create Trip/i }));
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
    });
  });
});
