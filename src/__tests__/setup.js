// Testing setup for component rendering, user interactions, //
// API integration, forms, routes, and authentication. //

import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

// Mock RannerApi backend functions.
jest.mock('../../api', () => ({
  login: jest.fn(),
  signUp: jest.fn(),
  getUser: jest.fn(),
  getTripsByUsername: jest.fn(),
  getTrips: jest.fn(),
  postTrip: jest.fn(),
  updateTrip: jest.fn(),
  deleteTrip: jest.fn(),
  getAirportSuggestions: jest.fn(),
  searchFlightOffers: jest.fn(),
  getFlightsByTrip: jest.fn(),
}));

// Mock date-fns to avoid timezone issues in tests.
jest.mock('date-fns', () => ({
  ...jest.requireActual('date-fns'),
  format: jest.fn(date => date.toISOString().split('T')[0]),
}));

// Test data.
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

// Custom render function that includes router and auth context.
export function renderWithContext(ui, { route = '/', user = null } = {}) {
  window.history.pushState({}, 'Test page', route);

  return render(
    <AuthProvider initialUser={user}>
      <BrowserRouter>{ui}</BrowserRouter>
    </AuthProvider>
  );
}

// Helper to wait for async operations.
export const waitForLoading = () => 
  new Promise(resolve => setTimeout(resolve, 0));