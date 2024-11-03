import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, ListGroup, Spinner } from 'react-bootstrap';
import { useAirportSearch } from '../hooks/useAirportSearch';
import ErrorAlert from './ErrorAlert';

function Origin() {
  const navigate = useNavigate();
  const {
    searchTerm: origin,
    suggestions,
    isLoading,
    error,
    handleChange,
    handleSuggestionClick,
    setError
  } = useAirportSearch();

  const handleNext = () => {
    if (!origin) {
      setError("Please select a starting location");
      return;
    }
    navigate("/destination", { state: { origin } });
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Choose Your Starting Location</h2>
      <ErrorAlert 
        error={error}
        onDismiss={() => setError(null)}
      />
      <Form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Enter city or airport"
            value={origin}
            onChange={handleChange}
            aria-label="Origin location search"
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
          <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
          <Button variant="primary" onClick={handleNext}>Next</Button>
        </div>
      </Form>
    </Container>
  );
}

export default Origin;