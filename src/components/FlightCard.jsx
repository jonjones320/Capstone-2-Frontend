import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Badge, Button, Alert } from 'react-bootstrap';
import RannerApi from '../../api';
import { useErrorHandler } from '../utils/errorHandler';
import ErrorDisplay from '../components/ErrorDisplay';

const FlightCard = ({ flight, onRemove, username }) => {
  const { error, handleError, clearError } = useErrorHandler();

  // Normalize flightData from either TripDetails || FlightList.
  const flightData = flight.flightDetails || flight;

  // Validate flight data.
  if (!flightData || !flightData.itineraries || flightData.itineraries.length === 0) {
    return (
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Alert variant="warning">
            <Alert.Heading>Flight Information Unavailable</Alert.Heading>
            <p>Sorry, we couldn't load the flight details at this time.</p>
          </Alert>
        </Card.Body>
      </Card>
    );
  }

  // Shorts date format for a better looking FlightCard.
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString([], { 
        dateStyle: 'short', 
        timeStyle: 'short' 
      });
    } catch (err) {
      handleError(new Error('Invalid date format'));
      return 'Date unavailable';
    }
  };

  // JSX for each leg of the flight order.
  const renderFlightLeg = (itinerary, legType) => {
    try {
      const departureSegment = itinerary.segments[0];
      const arrivalSegment = itinerary.segments[itinerary.segments.length - 1];

      return (
        <Col md={6}>
          <h5>{legType}</h5>
          <p>
            <strong>{departureSegment.departure.iataCode}</strong> → 
            <strong>{arrivalSegment.arrival.iataCode}</strong>
          </p>
          <p>
            {formatDate(departureSegment.departure.at)} - 
            {formatDate(arrivalSegment.arrival.at)}
          </p>
          <p>Duration: {itinerary.duration.replace('PT', '')}</p>
          <p>Stops: {itinerary.segments.length - 1}</p>
        </Col>
      );
    } catch (err) {
      handleError(new Error('Error rendering flight leg'));
      return (
        <Col md={6}>
          <Alert variant="danger">Error displaying flight segment</Alert>
        </Col>
      );
    }
  };

  const handleRemoveFlight = async () => {
    try {
      // Passes username in the req body for authentication.
      await RannerApi.deleteFlight(flight.id, username);
      onRemove(flight.id);
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <ErrorDisplay error={error} onClose={clearError} />
        <Card.Title className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">
            {flightData.itineraries[0].segments[0].departure.iataCode} ↔{' '}
            {flightData.itineraries[0].segments[flightData.itineraries[0].segments.length - 1].arrival.iataCode}
          </h3>
          <Badge bg="secondary">
            {flightData.validatingAirlineCodes?.[0] || 'N/A'}
          </Badge>
        </Card.Title>
        <Row className="mb-3">
          {renderFlightLeg(flightData.itineraries[0], 'Outbound')}
          {flightData.itineraries.length > 1 && 
            renderFlightLeg(flightData.itineraries[1], 'Return')}
        </Row>
        <div className="d-flex justify-content-between align-items-center">
          <Card.Text className="h4 mb-0">
            {flightData.price?.total || 'N/A'} {flightData.price?.currency || ''}
          </Card.Text>
          {flight.tripId && (
            <>
              <Button 
                as={Link} 
                to={`/flights/${flight.id}`} 
                variant="primary" 
                className="me-2"
              >
                View Details
              </Button>
              <Button 
                onClick={handleRemoveFlight} 
                variant="danger"
                aria-label="Remove flight"
              >
                Remove Flight
              </Button>
            </>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default FlightCard;