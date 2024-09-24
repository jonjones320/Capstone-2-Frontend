import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import RannerApi from '../../api';
import TripForm from './TripForm';
import { Container, Button, Alert } from 'react-bootstrap';

function TripDates() {
  const { currentUser } = useContext(AuthContext);
  const { state } = useLocation();
  const { origin, destination } = state || {};
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSaveTrip = async (tripData) => {
    setIsLoading(true);
    setError('');

    const fullTripData = {
      ...tripData,
      username: currentUser.username,
      origin: origin,
      destination: destination,
    };

    try {
      const savedTrip = await RannerApi.postTrip(fullTripData);
      navigate("/flights", { state: { trip: savedTrip.trip } });
    } catch (err) {
      setError(err.message || 'Failed to save trip. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/destination", { state: { origin, destination } });
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Create Your Trip</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {isLoading ? (
        <Alert variant="info">Saving trip...</Alert>
      ) : (
        <TripForm 
          initialData={{ origin, destination }}
          onSubmit={handleSaveTrip}
        />
      )}
      <Button variant="secondary" onClick={handleBack} className="mt-3">Back</Button>
    </Container>
  );
}

export default TripDates;