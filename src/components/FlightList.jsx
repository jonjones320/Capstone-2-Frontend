import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Spinner, Button, Card, Alert } from 'react-bootstrap';
import RannerApi from '../../api';
import FlightCard from './FlightCard';
import ErrorAlert from './ErrorAlert';

function FlightList() {
  const { state } = useLocation();
  const { trip } = state || {};
  const [data, setData] = useState([]);
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFlights() {
      if (!trip) {
        setError("Trip information is missing");
        setIsLoading(false);
        return;
      }
      try {
        setError(null);
        setIsLoading(true);
        
        const res = await RannerApi.searchFlightOffers({
          originLocationCode: trip.origin,
          destinationLocationCode: trip.destination,
          departureDate: trip.startDate,
          returnDate: trip.endDate,
          adults: Number(trip.passengers) || 1
        });

        if (res?.data) {
          setFlights(res.data);
        }
      } catch (err) {
        setError(err?.response?.data?.error?.message || "Failed to load flights");
      } finally {
        setIsLoading(false);
      }
    }
    fetchFlights();
  }, [trip]);

  /** JSX */

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Button variant="secondary" onClick={() => navigate(-1)} className="mb-3">
        &larr; Back
      </Button>
      
      <h2 className="mb-4">Flight Offers</h2>
      
      {error && (
        <ErrorAlert
        error={error}
        onDismiss={() => setError(null)}
        onRetry={fetchData}
        />
      )}

      {flights.map((flight) => (
        <Card key={flight.id} className="mb-4">
          <Card.Body>
            <FlightCard flight={flight} />
            <Button 
              onClick={() => navigate(`/trip/${trip.id}`)} 
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