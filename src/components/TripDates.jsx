import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import RannerApi from '../../api';
import TripForm from './TripForm';


function TripDates() {
  const { currentUser } = useContext(AuthContext);
  const { state } = useLocation();
  const { origin, destination } = state || {}; // Destructure origin and destination from state.
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
    <div>
      <h2>Create Your Trip</h2>
      {error && <p>{error}</p>}
      {isLoading ? (
        <p>Saving trip...</p>
      ) : (
        <TripForm 
          initialData={{ origin, destination }}
          onSubmit={handleSaveTrip}
        />
      )}
      <button onClick={handleBack}>Back</button>
    </div>
  );
}

export default TripDates;
