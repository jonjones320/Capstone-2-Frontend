import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Spinner, Button, Card, Alert } from 'react-bootstrap';
import RannerApi from '../../api';
import FlightCard from './FlightCard';
import ErrorAlert from './ErrorAlert';

function FlightList() {
  const { state } = useLocation();
  const { trip } = state || {};
  const [flights, setFlights] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0); // Addresses Amadeus API constraint.
  const navigate = useNavigate();

  const fetchFlights = async () => {
    if (!trip) {
      setError("Trip information is missing");
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);

      const res = await RannerApi.searchFlightOffers({
        originLocationCode: trip.origin,
        destinationLocationCode: trip.destination,
        departureDate: trip.startDate,
        returnDate: trip.endDate,
        adults: Number(trip.passengers) || 1
      });

      if (res.data) {
        setFlights(res.data);
        setError(null);
        setRetryCount(0); // Reset retry count on success.
      } else {
        setFlights([]);
      }
    } catch (err) {
      setFlights([]);
      // Addresses recurring Amadeus API constraint when using a test key.
      const isServerError = err?.response?.status === 500;
      setError(isServerError
        ? {
            message: "The flight search service is temporarily unavailable.",
            detail: "Note: This application uses Amadeus's test API, which occasionally requires multiple attempts. Please click 'Try Again' - it usually succeeds within 2-3 tries! This limitation would not exist with a production API key.",
            isTestApiError: true
          }
        : {
            message: err?.response?.data?.error?.message || 'Failed to load flights',
            isTestApiError: false
          }
      );
      setRetryCount(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  // fetchFlights is ran if there's a change to `trip`.
  useEffect(() => {
    fetchFlights();
  }, [trip]);

  // Makes POST request to server when a flight is selected to be added.
  const handleAddFlight = async (flight) => {
    try {
      const tripId = trip.tripId;
      await RannerApi.postFlight({ 
        tripId, 
        amadeusOrderId: flight.id,
        flightDetails: flight
      });
      navigate(`/trip/${tripId}`);
    } catch (err) {
      setError({
        message: err?.response?.data?.error?.message || "Error adding flight to trip",
        isTestApiError: false
      });
    }
  };

  // Reusable header fragment.
  const HeaderSection = () => (
    <>
      <Button variant="secondary" onClick={() => navigate(-1)} className="mb-3">
        &larr; Back
      </Button>
      <h2 className="mb-4">Flight Offers</h2>
    </>
  );

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading flights...</span>
        </Spinner>
      </Container>
    );
  }

  /**
   * JSX
   */

  return (
    <Container className="mt-5">
      <HeaderSection />
      
      {error && (
        <Alert variant={error.isTestApiError ? "warning" : "danger"} className="d-flex flex-column gap-2">
          <div>
            <strong>{error.message}</strong>
            {error.detail && <p className="mt-2 mb-0">{error.detail}</p>}
          </div>
          <div className="d-flex align-items-center gap-2">
            <Button 
              variant={error.isTestApiError ? "warning" : "outline-danger"} 
              size="sm" 
              onClick={fetchFlights}
            >
              Try Again {retryCount > 0 && `(Attempt ${retryCount + 1})`}
            </Button>
            {error.isTestApiError && retryCount > 0 && (
              <small className="text-muted">
                Keep trying! Success rate increases with each attempt.
              </small>
            )}
            {error.isTestApiError && retryCount > 15 && (
              <small className="text-muted">
                Ok... maybe let's try again later.
              </small>
            )}
          </div>
        </Alert>
      )}

      {!error && (!flights || flights.length === 0) && (
        <Alert variant="info">
          No flights found for your search criteria. Please try different dates or locations.
        </Alert>
      )}
      
      {flights && flights.length > 0 && flights.map((flight) => (
        <Card key={flight.id} className="mb-4">
          <Card.Body>
            <FlightCard flight={flight} />
            <Button 
              onClick={() => handleAddFlight(flight)} 
              className="mt-3 w-100"
              variant="primary"
            >
              Add Flight
            </Button>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}

export default FlightList;