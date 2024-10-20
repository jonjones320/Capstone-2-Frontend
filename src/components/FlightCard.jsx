import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import RannerApi from '../../api';

const FlightCard = ({ flight, onRemove }) => {
  const [error, setError] = useState(null);

  // Normalize flightData from either TripDetails || FLightList.
  const flightData = flight.flightDetails || flight;

  // Faulty flight data creates an error card.
  if (!flightData || !flightData.itineraries || flightData.itineraries.length === 0) {
    return (
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>Flight Information Unavailable</Card.Title>
          <Card.Text>Sorry, we couldn't load the flight details at this time.</Card.Text>
        </Card.Body>
      </Card>
    );
  }

  // Shortens date for better aesthetics. 
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
  };

  // Splits card into a rendering of departure and return segments (if roundtrip).
  const renderFlightLeg = (itinerary, legType) => {
    const departureSegment = itinerary.segments[0];
    const arrivalSegment = itinerary.segments[itinerary.segments.length - 1];

    return (
      <Col md={6}>
        <h5>{legType}</h5>
        <p>
          <strong>{departureSegment.departure.iataCode}</strong> → <strong>{arrivalSegment.arrival.iataCode}</strong>
        </p>
        <p>
          {formatDate(departureSegment.departure.at)} - {formatDate(arrivalSegment.arrival.at)}
        </p>
        <p>Duration: {itinerary.duration.replace('PT', '')}</p>
        <p>Stops: {itinerary.segments.length - 1}</p>
      </Col>
    );
  };

  const handleRemoveFlight = async () => {
    try {
      await RannerApi.deleteFlight(flight.id);
      onRemove(flight.id);
    } catch (error) {
      console.error('Error removing flight:', error);
      setError('Failed to delete flight.');
    }
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">
            {flightData.itineraries[0].segments[0].departure.iataCode} ↔ {flightData.itineraries[0].segments[flightData.itineraries[0].segments.length - 1].arrival.iataCode}
          </h3>
          <Badge bg="secondary">{flightData.validatingAirlineCodes?.[0] || 'N/A'}</Badge>
        </Card.Title>
        <Row className="mb-3">
          {renderFlightLeg(flightData.itineraries[0], 'Outbound')}
          {flightData.itineraries.length > 1 && renderFlightLeg(flightData.itineraries[1], 'Return')}
        </Row>
        <div className="d-flex justify-content-between align-items-center">
          <Card.Text className="h4 mb-0">
            {flightData.price?.total || 'N/A'} {flightData.price?.currency || ''}
          </Card.Text>
          {flight.tripId && (
            <>
              <Button as={Link} to={`/flights/${flight.id}`} variant="primary" className="me-2">
                View Details
              </Button>
              <Button onClick={handleRemoveFlight} variant="danger">
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