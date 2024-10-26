import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RannerApi from '../../api';
import { Container, Form, Button, ListGroup, Spinner } from 'react-bootstrap';
import { useErrorHandler } from '../utils/errorHandler';
import ErrorDisplay from '../components/ErrorDisplay';

function Origin() {
  const [origin, setOrigin] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { error, handleError, clearError } = useErrorHandler();

  const handleChange = async (e) => {
    setOrigin(e.target.value);
    if (e.target.value.length >= 3) {
      setIsLoading(true);
      try {
        const res = await RannerApi.getAirportSuggestions(e.target.value);
        setSuggestions(res);
      } catch (err) {
        handleError(err);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (iataCode) => {
    setOrigin(iataCode);
    setSuggestions([]);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleNext = () => {
    if (!origin) {
      handleError(new Error("Please select a starting location"));
      return;
    }
    navigate("/destination", { state: { origin } });
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Choose Your Starting Location</h2>
      <ErrorDisplay error={error} onClose={clearError} />
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
              <Spinner animation="border" role="status" size="sm" />
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
          <Button variant="secondary" onClick={handleBack}>Back</Button>
          <Button variant="primary" onClick={handleNext}>Next</Button>
        </div>
      </Form>
    </Container>
  );
}

export default Origin;