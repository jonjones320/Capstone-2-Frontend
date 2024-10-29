import React, { useEffect, useState, useContext } from 'react';
import { Container, Spinner, Button, Collapse, Row, Col } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';
import RannerApi from '../../api';
import TripCard from './TripCard';
import TripFilterForm from './TripFilterForm';
import { useErrorHandler } from '../utils/errorHandler';
import ErrorDisplay from '../components/ErrorDisplay';

function TripList() {
  const { currentUser } = useContext(AuthContext);
  const [trips, setTrips] = useState([]);
  const [filters, setFilters] = useState({});
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { error, handleError, clearError } = useErrorHandler();

  useEffect(() => {
    async function fetchTrips() {
      setIsLoading(true);
      try {
        const userFilters = { ...filters, username: currentUser.username };
        const fetchedTrips = await RannerApi.getTrips(userFilters);
        setTrips(fetchedTrips);
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (currentUser) {
      fetchTrips();
    }
  }, [filters, currentUser]);

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading trips...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="TripList">
      <h2 className="my-4">Trips</h2>
      <ErrorDisplay error={error} onClose={clearError} />
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
    </Container>
  );
}

export default TripList;