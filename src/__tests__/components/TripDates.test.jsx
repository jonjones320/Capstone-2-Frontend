import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithContext } from '../utils/testUtils';
import { mockUser, mockTrip } from '../helpers/testData';
import RannerApi from '../../../api';


// Mock TripForm BEFORE importing TripDates.
jest.mock('../../components/TripForm', () => {
  return function MockTripForm({ onSubmit }) {
    const handleSubmit = (e) => {
      e.preventDefault(); 
      onSubmit(mockTrip);
    };

    return (
      <form onSubmit={handleSubmit} role="form">
        <button type="submit">Mock Submit</button>
      </form>
    );
  };
});

// Mock router hooks with a complete state.
const mockNavigate = jest.fn();
const mockLocation = {
  state: {
    origin: 'SFO',
    destination: 'JFK'
  }
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => mockLocation,
  useNavigate: () => mockNavigate
}));

// Import TripDates AFTER all mocks are defined.
import TripDates from '../../components/TripDates';

describe('TripDates', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    RannerApi.postTrip.mockResolvedValue({ trip: mockTrip });
  });

  test('renders with correct initial data', () => {
    renderWithContext(<TripDates />, { user: mockUser });
    
    expect(screen.getByText(/create your trip/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /mock submit/i })).toBeInTheDocument();
  });

  test('handles API error', async () => {
    RannerApi.postTrip.mockRejectedValueOnce(new Error('Failed to create trip'));
    
    renderWithContext(<TripDates />, { user: mockUser });

    fireEvent.click(screen.getByRole('button', { name: /mock submit/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert'))
        .toHaveTextContent(/failed to create trip/i);
    });
  });

  test('handles missing location state', () => {
    // Override location mock for this test
    jest.spyOn(require('react-router-dom'), 'useLocation')
      .mockImplementationOnce(() => ({ state: null }));

    renderWithContext(<TripDates />, { user: mockUser });
    
    expect(mockNavigate).toHaveBeenCalledWith('/origin');
  });
});