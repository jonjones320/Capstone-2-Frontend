import React, { useState, useEffect } from 'react';
import RannerApi from '../../api';
import { useLocation } from 'react-router-dom';
import FlightCard from './FlightCard';
import { Container, Alert, Spinner } from 'react-bootstrap';

function FlightList() {
  const { state } = useLocation();
  const { trip } = state || {};
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await RannerApi.searchFlightOffers({
          originLocationCode: trip.origin,
          destinationLocationCode: trip.destination,
          departureDate: trip.startDate,
          returnDate: trip.endDate,
          adults: trip.passengers,
        });
        setFlights(res.data);
      } catch (err) {
        console.error("Error fetching flights:", err);
        setError("Unable to fetch flights. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (trip) {
      fetchFlights();
    }
  }, [trip]);

  if (isLoading) { 
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading flights...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) { 
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (flights.length === 0) {
    return (
      <Container className="mt-5">
        <Alert variant="info">
          No flights found for your search criteria. Please try different dates or locations.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Flight Offers</h2>
      {flights.map((flight) => (
        <FlightCard key={flight.id} flight={flight} />
      ))}
    </Container>
  );
}

export default FlightList;