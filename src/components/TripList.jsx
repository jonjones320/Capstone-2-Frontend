import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import RannerApi from '../../api';
import TripCard from './TripCard';
import TripFilterForm from './TripFilterForm';
import { Button, Collapse, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';

function TripList() {
  const { currentUser } = useContext(AuthContext);
  const [trips, setTrips] = useState([]);
  const [filters, setFilters] = useState({});
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTrips() {
      setIsLoading(true);
      setError(null);
      try {
        const userFilters = { ...filters, username: currentUser.username };
        const fetchedTrips = await RannerApi.getTrips(userFilters);
        setTrips(fetchedTrips);
      } catch (err) {
        console.error("Error fetching trips:", err);
        setError("Unable to load trips. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    if (currentUser) {
      fetchTrips();
    } else {
      setError("Please log in to view your trips.");
    }
  }, [filters, currentUser]); 

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  }
  
  return (
    <Container className="TripList">
      <h2 className="my-4">Trips</h2>
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
          <TripFilterForm onFilter={handleFilter} />
        </div>
      </Collapse>
      
      {isLoading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : trips.length === 0 ? (
        <Alert variant="info">No trips found. Try adjusting your filters or create a new trip!</Alert>
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