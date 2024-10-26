// Ranner API mock //

jest.mock('../api', () => ({
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
    getTripById: jest.fn()
  }));