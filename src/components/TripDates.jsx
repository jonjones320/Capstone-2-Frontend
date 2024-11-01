import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';
import RannerApi from '../../api';
import TripForm from './TripForm';
import ErrorAlert from './ErrorAlert';

function TripDates() {
  const { currentUser } = useContext(AuthContext);
  const { state } = useLocation();
  const { origin, destination } = state || {};
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSaveTrip = async (tripData) => {
    setIsLoading(true);
    setError(null);
    try {
      const fullTripData = {
        ...tripData,
        username: currentUser.username,
        origin: origin,
        destination: destination,
      };

      const savedTrip = await RannerApi.postTrip(fullTripData);
      console.log("0 - TripDates - savedTrip: ", savedTrip);
      navigate("/flights", { state: { trip: savedTrip.trip } });
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Failed to create trip');
    } finally {
      setIsLoading(false);
    }
  };

  if (!origin || !destination) {
    setError("Missing required location information");
    navigate("/origin");
    return null;
  }

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Create Your Trip</h2>
      <ErrorAlert 
        error={error}
        onDismiss={() => setError(null)}
      />
      <TripForm 
        initialData={{ origin, destination }}
        onSubmit={handleSaveTrip}
        isLoading={isLoading}
      />
      <Button 
        variant="secondary" 
        onClick={() => navigate("/destination", { state: { origin, destination } })} 
        className="mt-3"
      >
        Back
      </Button>
    </Container>
  );
}

export default TripDates;