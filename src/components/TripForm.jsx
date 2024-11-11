import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Form, Button, ListGroup, Spinner, Alert } from 'react-bootstrap';
import { useAirportSearch } from './helpers/useAirportSearch';

function TripForm({ initialData, onSubmit, isEdit = false }) {
  // Sets initial states and empty form fields.
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    passengers: 1,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Use separate instances of useAirportSearch for origin and destination.
  const originSearch = useAirportSearch();
  const destinationSearch = useAirportSearch();

  // Fills out forms whenever trip data is passed.
  useEffect(() => {
    if (initialData) {
      try {
        setFormData({
          name: initialData.name || '',
          startDate: initialData.startDate ? format(new Date(initialData.startDate), 'yyyy-MM-dd') : '',
          endDate: initialData.endDate ? format(new Date(initialData.endDate), 'yyyy-MM-dd') : '',
          passengers: initialData.passengers || 1,
        });
        // Set initial values for airport fields.
        if (initialData.origin) originSearch.handleSuggestionClick(initialData.origin);
        if (initialData.destination) destinationSearch.handleSuggestionClick(initialData.destination);
      } catch (err) {
        setError('Error loading trip data');
      }
    }
  }, [initialData]);

  // Handle non-airport field changes.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(data => ({ ...data, [name]: value }));
    setError(null);
  };

  // Immediately checks for issues with the form.
  const validateForm = () => {
    if (!formData.name?.trim()) {
      setError("Please enter a trip name");
      return false;
    }
    if (!originSearch.searchTerm) {
      setError("Please select a departure airport");
      return false;
    }
    if (!destinationSearch.searchTerm) {
      setError("Please select an arrival airport");
      return false;
    }
    if (originSearch.searchTerm === destinationSearch.searchTerm) {
      setError("Departure and arrival airports cannot be the same");
      return false;
    }
    if (!formData.startDate || !formData.endDate) {
      setError("Please select both departure and return dates");
      return false;
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError("Return date must be after departure date");
      return false;
    }
    if (formData.passengers < 1) {
      setError("Number of passengers must be at least 1");
      return false;
    }
    return true;
  };

  // Passes trip data to the parent component.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    setError(null);
    
    try {
      // Collects and formats data then passes it to the parent component.
      const dataToSubmit = {
        ...formData,
        origin: originSearch.searchTerm,
        destination: destinationSearch.searchTerm,
        startDate: format(new Date(formData.startDate), 'yyyy-MM-dd'),
        endDate: format(new Date(formData.endDate), 'yyyy-MM-dd'),
        passengers: parseInt(formData.passengers, 10),
      };
      await onSubmit(dataToSubmit);
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Failed to save trip');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} role="form">
      {(error || originSearch.error || destinationSearch.error) && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error || originSearch.error || destinationSearch.error}
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
          value={originSearch.searchTerm}
          onChange={originSearch.handleChange}
          placeholder="Enter city or airport"
          required
          disabled={isSaving}
        />
        <ListGroup>
          {originSearch.isLoading ? (
            <div className="text-center py-3">
              <Spinner animation="border" size="sm" />
            </div>
          ) : (
            originSearch.suggestions.map(suggestion => (
              <ListGroup.Item 
                key={suggestion.id} 
                action 
                onClick={() => originSearch.handleSuggestionClick(suggestion.iataCode)}
              >
                {suggestion.name} ({suggestion.iataCode})
              </ListGroup.Item>
            ))
          )}
        </ListGroup>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="destination">Destination:</Form.Label>
        <Form.Control
          id="destination"
          type="text"
          value={destinationSearch.searchTerm}
          onChange={destinationSearch.handleChange}
          placeholder="Enter city or airport"
          required
          disabled={isSaving}
        />
        <ListGroup>
          {destinationSearch.isLoading ? (
            <div className="text-center py-3">
              <Spinner animation="border" size="sm" />
            </div>
          ) : (
            destinationSearch.suggestions.map(suggestion => (
              <ListGroup.Item 
                key={suggestion.id} 
                action 
                onClick={() => destinationSearch.handleSuggestionClick(suggestion.iataCode)}
              >
                {suggestion.name} ({suggestion.iataCode})
              </ListGroup.Item>
            ))
          )}
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