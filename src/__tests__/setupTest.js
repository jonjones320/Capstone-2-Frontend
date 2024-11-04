import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configure testing-library
configure({
  testIdAttribute: 'data-testid',
});

// Mock console.error to reduce warnings
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      /Warning: ReactDOM.render is no longer supported/.test(args[0]) ||
      /Warning: act\(\)/.test(args[0]) ||
      /Warning: unmountComponentAtNode/.test(args[0]) ||
      /Invalid token specified/.test(args[0]) ||
      /Warning: `ReactDOMTestUtils.act`/.test(args[0])
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Mock RannerApi backend routes
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
  getFlight: jest.fn(),
  deleteFlight: jest.fn(),
  getTripById: jest.fn(),
  patchUser: jest.fn() 
}));

// Mock date-fns
jest.mock('date-fns', () => ({
  ...jest.requireActual('date-fns'),
  format: jest.fn(date => date.toISOString().split('T')[0]),
}));

// Reset all mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});