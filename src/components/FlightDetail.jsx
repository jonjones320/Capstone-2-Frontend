import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Spinner, Alert } from 'react-bootstrap';
import RannerApi from '../../api';

function FlightDetail() {
  const { id } = useParams();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlightDetails = async () => {
      setLoading(true);
      try {
        const result = await RannerApi.getFlight(id);
        setFlight(result);
      } catch (err) {
        console.error("Error fetching flight details:", err);
        setError("Failed to load flight details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFlightDetails();
  }, [id]);

  if (loading) return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Container>
  );

  if (error) return (
    <Container className="mt-5">
      <Alert variant="danger">{error}</Alert>
    </Container>
  );

  if (!flight) return (
    <Container className="mt-5">
      <Alert variant="info">No flight found.</Alert>
    </Container>
  );

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header as="h2">Flight Details</Card.Header>
        <Card.Body>
          <Card.Title>Route</Card.Title>
          <Card.Text>
            From: {flight.itineraries[0].segments[0].departure.iataCode} <br />
            To: {flight.itineraries[0].segments[0].arrival.iataCode}
          </Card.Text>
          <Card.Title className="mt-4">Price</Card.Title>
          <Card.Text>
            {flight.price.total} {flight.price.currency}
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default FlightDetail;