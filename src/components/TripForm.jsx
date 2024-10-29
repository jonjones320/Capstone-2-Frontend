import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Form, Button, ListGroup, Spinner } from 'react-bootstrap';
import RannerApi from '../../api';
import { useErrorHandler } from '../utils/errorHandler';
import ErrorDisplay from '../components/ErrorDisplay';

function TripForm({ initialData, onSubmit, isEdit = false }) {
  const [formData, setFormData] = useState({
    name: '',
    origin: '',
    destination: '',
    startDate: '',
    endDate: '',
    passengers: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const { error, handleError, clearError } = useErrorHandler();

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
        handleError(new Error('Error formatting dates'));
      }
    }
  }, [initialData]);

  const handleChange = async ({ target: { name, value } }) => {
    setFormData(data => ({ ...data, [name]: value }));
    clearError();

    if ((name === 'origin' || name === 'destination') && value.length >= 3) {
      setIsLoading(true);
      try {
        const res = await RannerApi.getAirportSuggestions(value);
        if (name === 'origin') {
          setOriginSuggestions(res);
        } else {
          setDestinationSuggestions(res);
        }
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const validateForm = () => {
    if (formData.origin.length > 100 || formData.destination.length > 100) {
      handleError(new Error('Location codes must be less than 100 characters'));
      return false;
    }
    if (formData.name.length > 50) {
      handleError(new Error('Trip name must be less than 50 characters'));
      return false;
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      handleError(new Error('Start date cannot be after end date'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const dataToSubmit = {
        ...formData,
        startDate: format(new Date(formData.startDate), 'yyyy-MM-dd'),
        endDate: format(new Date(formData.endDate), 'yyyy-MM-dd'),
        passengers: parseInt(formData.passengers, 10),
      };
      await onSubmit(dataToSubmit);
    } catch (err) {
      handleError(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <ErrorDisplay error={error} onClose={clearError} />

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