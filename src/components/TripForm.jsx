import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Form, Button, ListGroup, Spinner, Alert } from 'react-bootstrap';
import RannerApi from '../../api';

function TripForm({ initialData, onSubmit, isEdit = false }) {
  // Sets initial states and empty form fields.
  const [formData, setFormData] = useState({
    name: '',
    origin: '',
    destination: '',
    startDate: '',
    endDate: '',
    passengers: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState({ origin: [], destination: [] });
  const [error, setError] = useState(null);

  // Fills out forms whenever trip data is passed to this component.
  useEffect(() => {
    if (initialData) {
      try {
        setFormData({
          name: initialData.name || '',
          origin: initialData.origin || '',
          destination: initialData.destination || '',
          startDate: initialData.startDate ? format(new Date(initialData.startDate), 'yyyy-MM-dd') : '',
          endDate: initialData.endDate ? format(new Date(initialData.endDate), 'yyyy-MM-dd') : '',
          passengers: initialData.passengers || 1,
        });
      } catch (err) {
        setError('Error loading trip data');
      }
    }
  }, [initialData]);

  // Updates form data as user inputs it.
  const handleChange = async ({ target: { name, value } }) => {
    setFormData(data => ({ ...data, [name]: value }));
    setError(null);

    // As user inputs orign or destination, suggestions are requested from the server.
    if ((name === 'origin' || name === 'destination') && value.length >= 3) {
      setIsLoading(true);
      try {
        const res = await RannerApi.getAirportSuggestions(value);
        setSuggestions(prev => ({
          ...prev,
          [name]: res
        }));
      } catch (err) {
        setError('Failed to load airport suggestions');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Checks for simple, quick fixes before submitting the trip.
  const validateForm = () => {
    if (!formData.name) {
      setError('Trip name is required');
      return false;
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError('Start date cannot be after end date');
      return false;
    }
    return true;
  };

  // Passes trip data to the parent component.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);
    
    try {
      // Collects and formats data then passes it to the parent component.
      const dataToSubmit = {
        ...formData,
        startDate: format(new Date(formData.startDate), 'yyyy-MM-dd'),
        endDate: format(new Date(formData.endDate), 'yyyy-MM-dd'),
        passengers: parseInt(formData.passengers, 10),
      };
      await onSubmit(dataToSubmit);
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Failed to save trip');
    } finally {
      setIsLoading(false);
    }
  };

/**
 * JSX
 */

  return (
    <Form onSubmit={handleSubmit}>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Form.Group className="mb-3">
        <Form.Label htmlFor="tripName">Trip Name:</Form.Label>
        <Form.Control
          id="tripName"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={isSaving}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="origin">Origin:</Form.Label>
        <Form.Control
          id="origin"
          type="text"
          name="origin"
          value={formData.origin}
          onChange={handleChange}
          required
          disabled={isSaving}
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
        <Form.Label htmlFor="destination">Destination:</Form.Label>
        <Form.Control
          id="destination"
          type="text"
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          required
          disabled={isSaving}
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
        <Form.Label htmlFor="departureDate">Departure Date:</Form.Label>
        <Form.Control
          id="departureDate"
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
          disabled={isSaving}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="returnDate">Return Date:</Form.Label>
        <Form.Control
          id="returnDate"
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
          disabled={isSaving}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="passengers">Passengers:</Form.Label>
        <Form.Control
          id="passengers"
          type="number"
          name="passengers"
          value={formData.passengers}
          onChange={handleChange}
          min="1"
          required
          disabled={isSaving}
        />
      </Form.Group>

      <Button 
        type="submit" 
        variant="primary"
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <Spinner size="sm" role="status" className="me-2" />
            {isEdit ? 'Updating...' : 'Creating...'}
          </>
        ) : (
          isEdit ? 'Update Trip' : 'Create Trip'
        )}
      </Button>
    </Form>
  );
}

export default TripForm;