import React, { useEffect, useState, useContext } from 'react';
import { Container, Spinner, Button, Collapse, Row, Col, Alert } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';
import RannerApi from '../../api';
import TripCard from './TripCard';
import TripFilterForm from './TripFilterForm';

function TripList() {
  // Set states to update elements.
  const { currentUser } = useContext(AuthContext);
  const [trips, setTrips] = useState([]);
  const [filters, setFilters] = useState({});
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the trips from the server with or without filters.
  const fetchTrips = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userFilters = { ...filters, username: currentUser.username };
      const fetchedTrips = await RannerApi.getTrips(userFilters);
      setTrips(fetchedTrips);
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Failed to load trips');
    } finally {
      setIsLoading(false);
    }
  };

  // If filters or current user change, fetch new trips.
  useEffect(() => {
    if (currentUser) {
      fetchTrips();
    }
  }, [filters, currentUser]);

  // Loading display with spinner.
  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  /** 
   * JSX
   */

  return (
    <Container className="TripList">
      <h2 className="my-4">Your Trips</h2>
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
          <div className="mt-2">
            <Button variant="outline-danger" size="sm" onClick={fetchTrips}>
              Try Again
            </Button>
          </div>
        </Alert>
      )}

      <Button
        onClick={() => setOpen(!open)}
        aria-controls="filter-form-collapse"
        aria-expanded={open}
        variant="outline-primary"
        className="mb-3"
      >
        {open ? 'Hide Filters' : 'Show Filters'}
      </Button>
      
      <Collapse in={open}>
        <div id="filter-form-collapse">
          <TripFilterForm onFilter={setFilters} />
        </div>
      </Collapse>
      
      {trips.length === 0 ? (
        <Alert variant="info">
          No trips found. Start planning your next adventure!
        </Alert>
      ) : (
        <Row>
          {trips.map(trip => (
            <Col md={6} lg={4} key={trip.tripId} className="mb-4">
              <TripCard
                id={trip.tripId}
                name={trip.name}
                origin={trip.origin}
                destination={trip.destination}
                startDate={trip.startDate}
                endDate={trip.endDate}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default TripList;