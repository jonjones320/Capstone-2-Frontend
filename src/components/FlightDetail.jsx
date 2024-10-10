import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Spinner, Alert, Row, Col, Badge } from 'react-bootstrap';
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
        setFlight(result.flightDetails);
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

  const flightOffer = flight.flightOffers[0];
  const itinerary = flightOffer.itineraries[0];

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header as="h2">Flight Details</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Card.Title>Itinerary</Card.Title>
              {itinerary.segments.map((segment, index) => (
                <Card key={index} className="mb-3">
                  <Card.Body>
                    <h5>Segment {index + 1}</h5>
                    <p><strong>From:</strong> {segment.departure.iataCode} ({segment.departure.terminal})</p>
                    <p><strong>To:</strong> {segment.arrival.iataCode} ({segment.arrival.terminal})</p>
                    <p><strong>Departure:</strong> {new Date(segment.departure.at).toLocaleString()}</p>
                    <p><strong>Arrival:</strong> {new Date(segment.arrival.at).toLocaleString()}</p>
                    <p><strong>Duration:</strong> {segment.duration}</p>
                    <p><strong>Carrier:</strong> {segment.carrierCode} {segment.number}</p>
                    <p><strong>Aircraft:</strong> {segment.aircraft.code}</p>
                  </Card.Body>
                </Card>
              ))}
              <p><strong>Total Duration:</strong> {itinerary.duration}</p>
            </Col>
            <Col md={6}>
              <Card.Title>Price Details</Card.Title>
              <p><strong>Total:</strong> {flightOffer.price.total} {flightOffer.price.currency}</p>
              <p><strong>Base:</strong> {flightOffer.price.base} {flightOffer.price.currency}</p>
              <h5>Fees:</h5>
              {flightOffer.price.fees.map((fee, index) => (
                <p key={index}>{fee.type}: {fee.amount} {flightOffer.price.currency}</p>
              ))}
              <Card.Title className="mt-4">Additional Information</Card.Title>
              <p><strong>Booking Class:</strong> {flightOffer.travelerPricings[0].fareDetailsBySegment[0].class}</p>
              <p><strong>Cabin:</strong> {flightOffer.travelerPricings[0].fareDetailsBySegment[0].cabin}</p>
              <p><strong>Included Checked Bags:</strong> {flightOffer.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.quantity}</p>
              <p><strong>Last Ticketing Date:</strong> {new Date(flightOffer.lastTicketingDate).toLocaleDateString()}</p>
              <p><strong>Number of Bookable Seats:</strong> {flightOffer.numberOfBookableSeats}</p>
              <div>
                <strong>Validating Airline Codes: </strong>
                {flightOffer.validatingAirlineCodes.map((code, index) => (
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