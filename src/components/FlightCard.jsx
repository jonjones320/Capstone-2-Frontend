import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';

const FlightCard = ({ flight }) => {
  const departureSegment = flight.itineraries[0].segments[0];
  const arrivalSegment = flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1];

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">
            {departureSegment.departure.iataCode} to {arrivalSegment.arrival.iataCode}
          </h3>
          <Badge bg="secondary">{flight.validatingAirlineCodes[0]}</Badge>
        </Card.Title>
        <Row className="mb-3">
          <Col md={6}>
            <Card.Subtitle className="mb-2 text-muted">Departure</Card.Subtitle>
            <Card.Text>{new Date(departureSegment.departure.at).toLocaleString()}</Card.Text>
          </Col>
          <Col md={6}>
            <Card.Subtitle className="mb-2 text-muted">Arrival</Card.Subtitle>
            <Card.Text>{new Date(arrivalSegment.arrival.at).toLocaleString()}</Card.Text>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <Card.Text>
              <strong>Duration:</strong> {flight.itineraries[0].duration.replace('PT', '')}
            </Card.Text>
          </Col>
          <Col md={6}>
            <Card.Text>
              <strong>Stops:</strong> {flight.itineraries[0].segments.length - 1}
            </Card.Text>
          </Col>
        </Row>
        <div className="d-flex justify-content-between align-items-center">
          <Card.Text className="h4 mb-0">
            {flight.price.total} {flight.price.currency}
          </Card.Text>
          <Button as={Link} to={`/flights/${flight.id}`} variant="primary">
            View Details
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default FlightCard;