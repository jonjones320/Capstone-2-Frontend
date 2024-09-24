import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import RannerApi from '../../api';
import { Form, Button, Alert, ListGroup } from 'react-bootstrap';

function TripForm({ initialData, onSubmit, isEdit = false }) {
  const [formData, setFormData] = useState({
    name: '',
    origin: '',
    destination: '',
    startDate: '',
    endDate: '',
    passengers: 1,
  });
  const [error, setError] = useState(null);
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        origin: initialData.origin || '',
        destination: initialData.destination || '',
        startDate: initialData.startDate ? format(new Date(initialData.startDate), 'yyyy-MM-dd') : '',
        endDate: initialData.endDate ? format(new Date(initialData.endDate), 'yyyy-MM-dd') : '',
        passengers: initialData.passengers || 1,
      });
    }
  }, [initialData]);

  const handleChange = async ({ target: { name, value } }) => {
    setFormData(data => ({ ...data, [name]: value }));

    if (name === 'origin' && value.length >= 3) {
      const res = await RannerApi.getAirportSuggestions(value);
      setOriginSuggestions(res);
    } else if (name === 'destination' && value.length >= 3) {
      const res = await RannerApi.getAirportSuggestions(value);
      setDestinationSuggestions(res);
    }
  };

  const handleSuggestionClick = (name, iataCode) => {
    setFormData(data => ({ ...data, [name]: iataCode }));
    if (name === 'origin') {
      setOriginSuggestions([]);
    } else if (name === 'destination') {
      setDestinationSuggestions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.origin.length > 100 || formData.destination.length > 100 || formData.name.length > 50) {
      setError('Location must be less than 101 characters and Name must be less than 51 characters.');
      return;
    };

    const dataToSubmit = { 
      ...formData, 
      startDate: format(new Date(formData.startDate), 'yyyy-MM-dd'),
      endDate: format(new Date(formData.endDate), 'yyyy-MM-dd'),
      passengers: parseInt(formData.passengers, 10),
    };

    onSubmit(dataToSubmit);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Trip Name:</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Origin:</Form.Label>
        <Form.Control
          type="text"
          name="origin"
          value={formData.origin}
          onChange={handleChange}
          required
        />
        <ListGroup>
          {originSuggestions.map(suggestion => (
            <ListGroup.Item key={suggestion.id} action onClick={() => handleSuggestionClick('origin', suggestion.iataCode)}>
              {suggestion.name} ({suggestion.iataCode})
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Destination:</Form.Label>
        <Form.Control
          type="text"
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          required
        />
        <ListGroup>
          {destinationSuggestions.map(suggestion => (
            <ListGroup.Item key={suggestion.id} action onClick={() => handleSuggestionClick('destination', suggestion.iataCode)}>
              {suggestion.name} ({suggestion.iataCode})
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Departure Date:</Form.Label>
        <Form.Control
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Return Date:</Form.Label>
        <Form.Control
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Passengers:</Form.Label>
        <Form.Control
          type="number"
          name="passengers"
          value={formData.passengers}
          onChange={handleChange}
          min="1"
          required
        />
      </Form.Group>

      <Button type="submit" variant="primary">
        {isEdit ? 'Update Trip' : 'Create Trip'}
      </Button>
    </Form>
  );
}

export default TripForm;