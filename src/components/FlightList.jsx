import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Spinner, Button, Card } from 'react-bootstrap';
import { format } from 'date-fns';
import RannerApi from '../../api';
import FlightCard from './FlightCard';
import ErrorDisplay from './ErrorDisplay';
import { useErrorHandler } from '../utils/errorHandler';

function FlightList() {
  const { state } = useLocation();
  const { trip } = state || {};
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { error, handleError } = useErrorHandler();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFlights() {
      if (!trip) {
        handleError(new Error("Trip information is missing"));
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);

        // Format dates to YYYY-MM-DD for Amadeus API.
        const formattedStartDate = format(new Date(trip.startDate), 'yyyy-MM-dd');
        const formattedEndDate = format(new Date(trip.endDate), 'yyyy-MM-dd');
        
        const res = await RannerApi.searchFlightOffers({
          originLocationCode: trip.origin,
          destinationLocationCode: trip.destination,
          departureDate: formattedStartDate,
          returnDate: formattedEndDate,
          adults: Number(trip.passengers) || 1
        });

        // Check if res.data exists and is an array.
        if (res && res.data && Array.isArray(res.data)) {
          setFlights(res.data);
        } else {
          handleError(new Error("No flights found for these dates and locations."));
        }
      } catch (err) {
        console.error("Error fetching flights:", err);
        handleError(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFlights();
  }, [trip]);

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
      handleError(err);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

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

  if (error) { 
    return (
      <Container className="mt-5">
        <Button variant="secondary" onClick={handleBack} className="mb-3">
          &larr; Back
        </Button>
        <ErrorDisplay error={error} />
      </Container>
    );
  }

  // Only check flights length after we're done loading and have no errors.
  if (!flights || flights.length === 0) {
    return (
      <Container className="mt-5">
        <Button variant="secondary" onClick={handleBack} className="mb-3">
          &larr; Back
        </Button>
        <ErrorDisplay 
          error={{ 
            message: "No flights found for your search criteria. Please try different dates or locations."
          }} 
          variant="info"
        />
      </Container>
    );
  }

  return (
    <Container className="mt-5">
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