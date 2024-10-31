import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';

function TripFilterForm({ onFilter }) {
  // Set filters as empty initially.
  const initialFilters = {
    name: '',
    origin: '',
    destination: '',
    startDate: '',
    endDate: '',
    passengers: ''
  };
  
  // Create filter and error states to manage changes.
  const [filters, setFilters] = useState(initialFilters);
  const [error, setError] = useState(null);

  // Upon change, 'target' filter is updated and errors are cleared.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(f => ({ ...f, [name]: value }));
    setError(null);  // Clear any existing error
  };

  // Hopefully any errors are immediately caught/corrected here.
  const validateFilters = () => {
    if (filters.startDate && filters.endDate && 
        new Date(filters.startDate) > new Date(filters.endDate)) {
      setError('Start date cannot be after end date');
      return false;
    }
    if (filters.passengers && filters.passengers < 1) {
      setError('Passengers must be at least 1');
      return false;
    }
    return true;
  };

  // Validates filter & passes filters to parent component for submission.
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateFilters()) {
      onFilter(filters);
    }
  };

  // Reset filters and errors.
  const handleReset = () => {
    setFilters(initialFilters);
    setError(null);
    onFilter(initialFilters);
  };

/** 
 * JSX Displays 
*/

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
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
        >
          Reset
        </Button>
        <Button 
          variant="primary" 
          type="submit"
        >
          Apply Filters
        </Button>
      </div>
    </Form>
  );
}

export default TripFilterForm;