import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RannerApi from '../../api';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';

function Origin() {
  const [origin, setOrigin] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const handleChange = async (e) => {
    setOrigin(e.target.value);
    if (e.target.value.length >= 3) {
      const res = await RannerApi.getAirportSuggestions(e.target.value);
      setSuggestions(res);
    }
  };

  const handleSuggestionClick = (iataCode) => {
    setOrigin(iataCode);
    setSuggestions([]);
  };

  const handleBack = () => {
    navigate(-1);
  }

  const handleNext = () => {
    navigate("/destination", { state: { origin } });
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Choose Your Starting Location</h2>
      <Form>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Enter city or airport"
            value={origin}
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

export default Origin;
