import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';

const FlightCard = ({ flight }) => {
  console.log("FlightCard.jsx - FlightCard - FLIGHT: ", flight);
  // Handle bad or missing data.
  if (!flight || !flight.itineraries || flight.itineraries.length === 0) {
    return (
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>Flight Information Unavailable</Card.Title>
          <Card.Text>Sorry, we couldn't load the flight details at this time.</Card.Text>
        </Card.Body>
      </Card>
    );
  }

  const departureSegment = flight.itineraries[0].segments[0] || {};
  const arrivalSegment = flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1] || {};

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">
            {departureSegment.departure?.iataCode || 'N/A'} to {arrivalSegment.arrival?.iataCode || 'N/A'}
          </h3>
          <Badge bg="secondary">{flight.validatingAirlineCodes?.[0] || 'N/A'}</Badge>
        </Card.Title>
        <Row className="mb-3">
          <Col md={6}>
            <Card.Subtitle className="mb-2 text-muted">Departure</Card.Subtitle>
            <Card.Text>{departureSegment.departure?.at ? new Date(departureSegment.departure.at).toLocaleString() : 'N/A'}</Card.Text>
          </Col>
          <Col md={6}>
            <Card.Subtitle className="mb-2 text-muted">Arrival</Card.Subtitle>
            <Card.Text>{arrivalSegment.arrival?.at ? new Date(arrivalSegment.arrival.at).toLocaleString() : 'N/A'}</Card.Text>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <Card.Text>
              <strong>Duration:</strong> {flight.itineraries[0].duration ? flight.itineraries[0].duration.replace('PT', '') : 'N/A'}
            </Card.Text>
          </Col>
          <Col md={6}>
            <Card.Text>
              <strong>Stops:</strong> {flight.itineraries[0].segments ? flight.itineraries[0].segments.length - 1 : 'N/A'}
            </Card.Text>
          </Col>
        </Row>
        <div className="d-flex justify-content-between align-items-center">
          <Card.Text className="h4 mb-0">
            {flight.price?.total || 'N/A'} {flight.price?.currency || ''}
          </Card.Text>
          {flight.id && (
            <Button as={Link} to={`/flights/${flight.id}`} variant="primary">
              View Details
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default FlightCard;