import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Form, Button, ListGroup, Spinner } from 'react-bootstrap';
import { useAirportSearch } from './helpers/useAirportSearch';
import ErrorAlert from './ErrorAlert';

function Destination() {
  const navigate = useNavigate();
  const location = useLocation();
  const { origin } = location.state || {};
  const {
    searchTerm: destination,
    suggestions,
    isLoading,
    error,
    handleChange,
    handleSuggestionClick,
    setError
  } = useAirportSearch();

  const handleNext = () => {
    if (!destination) {
      setError("Please select a destination");
      return;
    }
    navigate("/dates", { state: { origin, destination } });
  };

  if (!origin) {
    setError("Origin location is missing");
    navigate("/origin");
    return null;
  }

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Choose Your Destination</h2>
      <ErrorAlert 
        error={error}
        onDismiss={() => setError(null)}
      />
      <Form>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Enter city or airport"
            value={destination}
            onChange={handleChange}
            aria-label="Enter city or airport"
          />
        </Form.Group>
        <ListGroup className="mb-3">
          {isLoading ? (
            <div className="text-center py-3">
              <Spinner animation="border" size="sm" />
            </div>
          ) : (
            suggestions.map((suggestion) => (
              <ListGroup.Item 
                key={suggestion.id} 
                action 
                onClick={() => handleSuggestionClick(suggestion.iataCode)}
              >
                {suggestion.name} ({suggestion.iataCode})
              </ListGroup.Item>
            ))
          )}
        </ListGroup>
        <div className="d-flex justify-content-between">
          <Button 
            variant="secondary" 
            onClick={() => navigate("/origin", { state: { origin } })}
          >
            Back
          </Button>
          <Button variant="primary" onClick={handleNext}>Next</Button>
        </div>
      </Form>
    </Container>
  );
}

export default Destination;