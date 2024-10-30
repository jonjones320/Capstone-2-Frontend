import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useErrorHandler } from '../utils/errorHandler';
import ErrorDisplay from './ErrorAlert';

function TripFilterForm({ onFilter }) {
  const initialFilters = {
    name: '',
    origin: '',
    destination: '',
    startDate: '',
    endDate: '',
    passengers: ''
  };
  const [filters, setFilters] = useState(initialFilters);
  const { error, handleError, clearError } = useErrorHandler();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(f => ({
      ...f,
      [name]: value
    }));
    clearError();
  };

  const validateFilters = () => {
    if (filters.startDate && filters.endDate && 
        new Date(filters.startDate) > new Date(filters.endDate)) {
      handleError(new Error('Start date cannot be after end date'));
      return false;
    }
    if (filters.passengers && filters.passengers < 1) {
      handleError(new Error('Passengers must be at least 1'));
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateFilters()) return;
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    clearError();
    onFilter(initialFilters);
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <ErrorDisplay error={error} onClose={clearError} />
      <Row>
        <Col md={6} lg={4}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Trip Name"
              aria-label="Trip Name"
              value={filters.name}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6} lg={4}>
          <Form.Group className="mb-3">
            <Form.Label>Origin</Form.Label>
            <Form.Control
              type="text"
              name="origin"
              placeholder="Origin"
              aria-label="Origin"
              value={filters.origin}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6} lg={4}>
          <Form.Group className="mb-3">
            <Form.Label>Destination</Form.Label>
            <Form.Control
              type="text"
              name="destination"
              placeholder="Destination"
              aria-label="Destination"
              value={filters.destination}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6} lg={4}>
          <Form.Group className="mb-3">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              name="startDate"
              aria-label="Start Date"
              value={filters.startDate}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6} lg={4}>
          <Form.Group className="mb-3">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              name="endDate"
              aria-label="End Date"
              value={filters.endDate}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6} lg={4}>
          <Form.Group className="mb-3">
            <Form.Label>Passengers</Form.Label>
            <Form.Control
              type="number"
              name="passengers"
              aria-label="Passengers"
              value={filters.passengers}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <div className="d-flex justify-content-end gap-2">
        <Button 
          variant="secondary" 
          onClick={handleReset}
          type="button"
          aria-label="Reset filters"
        >
          Reset
        </Button>
        <Button 
          variant="primary" 
          type="submit"
          aria-label="Apply filters"
        >
          Apply Filters
        </Button>
      </div>
    </Form>
  );
}

export default TripFilterForm;