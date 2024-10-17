import React, { useEffect, useState } from 'react';
import RannerApi from '../../api';
import TripCard from './TripCard';
import TripFilterForm from './TripFilterForm';
import { Button, Collapse, Container, Row, Col } from 'react-bootstrap';

function TripList() {
  const [trips, setTrips] = useState([]);
  const [filters, setFilters] = useState({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchTrips() {
      const trips = await RannerApi.getTrips(filters);
      setTrips(trips);
    }
    fetchTrips();
  }, [filters]);

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