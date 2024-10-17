import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({
      ...f,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    onFilter(initialFilters);
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Row>
        <Col md={6} lg={4}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Trip Name"
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
              value={filters.passengers}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <div className="d-flex justify-content-end">
        <Button variant="secondary" onClick={handleReset} className="me-2">
          Reset
        </Button>
        <Button variant="primary" type="submit">
          Apply Filters
        </Button>
      </div>
    </Form>
  );
}

export default TripFilterForm;