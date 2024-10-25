import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useErrorHandler } from '../utils/errorHandler';
import ErrorDisplay from '../components/ErrorDisplay';
import RannerApi from '../../api';
import FlightCard from './FlightCard';
import { Container, Alert, Spinner, Button, Card } from 'react-bootstrap';

function FlightList() {
  const { state } = useLocation();
  const { trip } = state || {};
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { error, handleError, clearError } = useErrorHandler();
  const navigate = useNavigate();

  useEffect(() => {

    // Retrieves flight offers from Amadeus API.
    const fetchFlights = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await RannerApi.searchFlightOffers({
          originLocationCode: trip.origin,
          destinationLocationCode: trip.destination,
          departureDate: trip.startDate,
          returnDate: trip.endDate,
          adults: trip.passengers
        });
        setFlights(res.data);
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (trip) {
      fetchFlights();
    }
  }, [trip]);

  // Saves flight to the database with Amadeus flightOrder object and Ranner tripId.
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
      console.error("Error adding flight to trip:", err);
      setError("Unable to add flight to trip. Please try again later.");
    }
  };

  // Uses browser previous page to "go back".
  const handleBack = () => {
    navigate(-1);
  };

  // Loading flights JSX display.
  if (isLoading) { 
    return (
      <Container 
        className="d-flex justify-content-center align-items-center" 
        style={{ height: '100vh' }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading flights...</span>
        </Spinner>
      </Container>
    );
  }

  // JSX display if no flights are found.
  if (flights.length === 0) {
    return (
      <Container className="mt-5">
        <Button variant="secondary" onClick={handleBack} className="mb-3">
          &larr; Back
        </Button>
        <Alert variant="info">
          No flights found for your search criteria. Please try different dates or locations.
        </Alert>
      </Container>
    );
  }

  // Flight List JSX display. Creates a FlightCard for each flight.
  return (
    <Container className="mt-5">
      <ErrorDisplay error={error} onClose={clearError} />
      <Button variant="secondary" onClick={handleBack} className="mb-3">
        &larr; Back
      </Button>
      <h2 className="mb-4">Flight Offers</h2>
      {flights.map((flight) => (
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