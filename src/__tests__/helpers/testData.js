export const mockUser = {
  username: 'testuser',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@test.com',
};

export const mockTrip = {
  tripId: 1,
  name: 'Test Trip',
  origin: 'SFO',
  destination: 'JFK',
  startDate: '2024-12-01',
  endDate: '2024-12-07',
  passengers: 2,
};

export const mockFlight = {
  id: 1,
  tripId: 1,
  flightOfferId: 'ABC123',
  outboundFlightNumber: 'UA123',
  inboundFlightNumber: 'UA456',
  price: { total: '500.00', currency: 'USD' },
  itineraries: [
    {
      duration: 'PT5H30M',
      segments: [
        {
          departure: { iataCode: 'SFO', at: '2024-12-01T10:00:00' },
          arrival: { iataCode: 'JFK', at: '2024-12-01T15:30:00' },
        },
      ],
    },
  ],
};

export const waitForLoading = () => new Promise(resolve => setTimeout(resolve, 0));