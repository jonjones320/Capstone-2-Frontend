import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';
import RannerApi from '../../api';
import TripForm from './TripForm';
import { useErrorHandler } from '../utils/errorHandler';
import ErrorDisplay from './ErrorAlert';

function TripDates() {
  const { currentUser } = useContext(AuthContext);
  const { state } = useLocation();
  const { origin, destination } = state || {};
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { error, handleError, clearError } = useErrorHandler();

  const handleSaveTrip = async (tripData) => {
    setIsLoading(true);
    try {
      const fullTripData = {
        ...tripData,
        username: currentUser.username,
        origin: origin,
        destination: destination,
      };

      const savedTrip = await RannerApi.postTrip(fullTripData);
      navigate("/flights", { state: { trip: savedTrip.trip } });
    } catch (err) {
      handleError(err);
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
      <ErrorDisplay error={error} onClose={clearError} />
      <TripForm 
        initialData={{ origin, destination }}
        onSubmit={handleSaveTrip}
        isLoading={isLoading}
      />
      <Button variant="secondary" onClick={handleBack} className="mt-3">Back</Button>
    </Container>
  );
}

export default TripDates;