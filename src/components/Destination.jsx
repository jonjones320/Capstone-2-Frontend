import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RannerApi from '../../api';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';

function Destination() {
  const [destination, setDestination] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { origin } = location.state || {};

  const handleChange = async (e) => {
    setDestination(e.target.value);
    if (e.target.value.length >= 3) {
      const res = await RannerApi.getAirportSuggestions(e.target.value);
      setSuggestions(res);
    }
  };

  const handleSuggestionClick = (iataCode) => {
    setDestination(iataCode);
    setSuggestions([]);
  };

  const handleBack = () => {
    navigate("/origin", { state: { origin } });
  };

  const handleNext = () => {
    navigate("/dates", { state: { origin, destination } });
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Choose Your Destination</h2>
      <Form>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Enter city or airport"
            value={destination}
            onChange={handleChange}
          />
        </Form.Group>
        <ListGroup className="mb-3">
          {suggestions.map((suggestion) => (
            <ListGroup.Item key={suggestion.id} action onClick={() => handleSuggestionClick(suggestion.iataCode)}>
              {suggestion.name} ({suggestion.iataCode})
            </ListGroup.Item>
          ))}
        </ListGroup>
        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={handleBack}>Back</Button>
          <Button variant="primary" onClick={handleNext}>Next</Button>
        </div>
      </Form>
    </Container>
  );
}

export default Destination;