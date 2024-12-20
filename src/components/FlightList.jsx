import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Spinner, Button, Card, Alert } from 'react-bootstrap';
import { ErrorHandler } from '../utils/errorHandler';
import RannerApi from '../../api';
import FlightCard from './FlightCard';

function FlightList() {
  const { state } = useLocation();
  const { trip } = state || {};
  const [flights, setFlights] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchFlights = async () => {
    if (!trip) {
      setError({
        message: "Trip information is missing",
        isTestApiError: false
      });
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
      }
      else {
        setFlights([]);
      }
    } catch (err) {
      const isTimeout = err.code === "ECONNABORTED" || err.response?.status === 504;
      if (isTimeout) {
        setError(new RetryableError(
          "The flight search is taking longer than expected. Please try again.",
          2000
        ));
      } else {
        setError(ErrorHandler.handleApiError(err));
      };
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
      setError(err?.response?.data?.error?.message || "Error adding flight to trip");
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

  // Loading spinner display.
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
        <Alert 
          role="alert"
          variant={error.isTestApiError ? "info" : "danger"} 
          className="d-flex flex-column gap-2"
        >
          <div>
            <strong>{typeof error === 'string' ? error : error.message}</strong>
            {error.detail && <p className="mt-2 mb-0">{error.detail}</p>}
          </div>
          {!error.isTestApiError && (
            <Button 
              variant="outline-danger" 
              size="sm" 
              onClick={fetchFlights}
            >
              Try Again
            </Button>
          )}
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