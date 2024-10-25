import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithContext, mockFlight, mockUser } from '../setup';
import FlightCard from '../../components/FlightCard';
import RannerApi from '../../../api';

describe('FlightCard', () => {
  const mockOnRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders flight details correctly', () => {
    renderWithContext(
      <FlightCard 
        flight={mockFlight} 
        onRemove={mockOnRemove} 
        username={mockUser.username} 
      />
    );

    // Check basic flight information
    expect(screen.getByText('SFO ↔ JFK')).toBeInTheDocument();
    expect(screen.getByText('500.00 USD')).toBeInTheDocument();
    expect(screen.getByText(/duration:/i)).toBeInTheDocument();
    expect(screen.getByText(/stops:/i)).toBeInTheDocument();
  });

  test('handles flight removal', async () => {
    RannerApi.deleteFlight.mockResolvedValueOnce();
    
    renderWithContext(
      <FlightCard 
        flight={{ ...mockFlight, tripId: 1 }}
        onRemove={mockOnRemove}
        username={mockUser.username}
      />
    );

    const removeButton = screen.getByRole('button', { name: /remove flight/i });
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(RannerApi.deleteFlight).toHaveBeenCalledWith(
        mockFlight.id, 
        mockUser.username
      );
      expect(mockOnRemove).toHaveBeenCalledWith(mockFlight.id);
    });
  });

  test('handles flight removal error', async () => {
    RannerApi.deleteFlight.mockRejectedValueOnce(new Error('Failed to delete flight'));
    
    renderWithContext(
      <FlightCard 
        flight={{ ...mockFlight, tripId: 1 }}
        onRemove={mockOnRemove}
        username={mockUser.username}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /remove flight/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/failed to delete flight/i);
      expect(mockOnRemove).not.toHaveBeenCalled();
    });
  });

  test('renders error card for invalid flight data', () => {
    const invalidFlight = {
      id: 1,
      tripId: 1,
      flightDetails: null
    };

    renderWithContext(
      <FlightCard 
        flight={invalidFlight}
        onRemove={mockOnRemove}
        username={mockUser.username}
      />
    );

    expect(screen.getByText(/flight information unavailable/i)).toBeInTheDocument();
  });

  test('formats dates correctly', () => {
    renderWithContext(
      <FlightCard 
        flight={mockFlight}
        onRemove={mockOnRemove}
        username={mockUser.username}
      />
    );

    // Check if dates are formatted correctly
    const formattedDate = new Date(mockFlight.itineraries[0].segments[0].departure.at)
      .toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
    expect(screen.getByText(new RegExp(formattedDate, 'i'))).toBeInTheDocument();
  });

  test('shows flight leg information for roundtrip', () => {
    const roundtripFlight = {
      ...mockFlight,
      itineraries: [
        ...mockFlight.itineraries,
        {
          duration: 'PT5H30M',
          segments: [
            {
              departure: { iataCode: 'JFK', at: '2024-12-07T10:00:00' },
              arrival: { iataCode: 'SFO', at: '2024-12-07T15:30:00' },
            },
          ],
        },
      ],
    };

    renderWithContext(
      <FlightCard 
        flight={roundtripFlight}
        onRemove={mockOnRemove}
        username={mockUser.username}
      />
    );

    expect(screen.getByText(/outbound/i)).toBeInTheDocument();
    expect(screen.getByText(/return/i)).toBeInTheDocument();
  });
});