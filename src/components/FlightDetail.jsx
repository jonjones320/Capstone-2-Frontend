import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Spinner, Button, Row, Col, Badge } from 'react-bootstrap';
import RannerApi from '../../api';
import { useErrorHandler } from '../utils/errorHandler';
import ErrorDisplay from '../components/ErrorDisplay';

function FlightDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const { error, handleError, clearError } = useErrorHandler();

  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        setLoading(true);
        const result = await RannerApi.getFlight(id);
        setFlight(result);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlightDetails();
  }, [id, handleError]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!flight) return null;

  const { flightDetails } = flight;

  return (
    <Container className="mt-5">
      <ErrorDisplay error={error} onClose={clearError} />
      <Button variant="secondary" onClick={handleBack} className="mb-3">
        &larr; Back
      </Button>
      <Card>
        <Card.Header as="h2">Flight Details</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Card.Title>Itinerary</Card.Title>
              {flightDetails.itineraries.map((itinerary, itineraryIndex) => (
                <Card key={itineraryIndex} className="mb-3">
                  <Card.Body>
                    <h5>{itineraryIndex === 0 ? 'Outbound' : 'Return'} Flight</h5>
                    <p><strong>Duration:</strong> {itinerary.duration}</p>
                    {itinerary.segments.map((segment, segmentIndex) => (
                      <Card key={segmentIndex} className="mb-2">
                        <Card.Body>
                          <h6>Segment {segmentIndex + 1}</h6>
                          <p><strong>From:</strong> {segment.departure.iataCode}</p>
                          <p><strong>To:</strong> {segment.arrival.iataCode}</p>
                          <p><strong>Departure:</strong> {new Date(segment.departure.at).toLocaleString()}</p>
                          <p><strong>Arrival:</strong> {new Date(segment.arrival.at).toLocaleString()}</p>
                          <p><strong>Duration:</strong> {segment.duration}</p>
                          <p><strong>Carrier:</strong> {segment.carrierCode} {segment.number}</p>
                          <p><strong>Aircraft:</strong> {segment.aircraft.code}</p>
                        </Card.Body>
                      </Card>
                    ))}
                  </Card.Body>
                </Card>
              ))}
            </Col>
            <Col md={6}>
              <Card.Title>Price Details</Card.Title>
              <p><strong>Total:</strong> {flightDetails.price.total} {flightDetails.price.currency}</p>
              <p><strong>Base:</strong> {flightDetails.price.base} {flightDetails.price.currency}</p>
              <h5>Fees:</h5>
              {flightDetails.price.fees.map((fee, index) => (
                <p key={index}>{fee.type}: {fee.amount} {flightDetails.price.currency}</p>
              ))}
              <Card.Title className="mt-4">Additional Information</Card.Title>
              {flightDetails.travelerPricings && flightDetails.travelerPricings[0] && flightDetails.travelerPricings[0].fareDetailsBySegment && (
                <>
                  <p><strong>Booking Class:</strong> {flightDetails.travelerPricings[0].fareDetailsBySegment[0].class}</p>
                  <p><strong>Cabin:</strong> {flightDetails.travelerPricings[0].fareDetailsBySegment[0].cabin}</p>
                  <p><strong>Included Checked Bags:</strong> {flightDetails.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags?.quantity || 'N/A'}</p>
                </>
              )}
              <p><strong>Last Ticketing Date:</strong> {new Date(flightDetails.lastTicketingDate).toLocaleDateString()}</p>
              <p><strong>Number of Bookable Seats:</strong> {flightDetails.numberOfBookableSeats}</p>
              <div>
                <strong>Validating Airline Codes: </strong>
                {flightDetails.validatingAirlineCodes.map((code, index) => (
                  <Badge key={index} bg="secondary" className="me-1">{code}</Badge>
                ))}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default FlightDetail;