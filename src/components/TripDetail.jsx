import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RannerApi from '../../api';
import AuthContext from '../context/AuthContext';
import TripForm from './TripForm';

function TripDetailEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [trip, setTrip] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTrip = async () => {
    setIsLoading(true);
    try {
      const fetchedTrip = await RannerApi.getTripById(id);
      setTrip(fetchedTrip);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch trip:', err);
      setError('Failed to load trip details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const handleDelete = async () => {
    try {
      await RannerApi.deleteTrip(id);
      navigate('/trips');
    } catch (err) {
      console.error('Failed to delete trip:', err);
      setError('Failed to delete trip.');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = async (updatedTripData) => {
    setIsLoading(true);
    try {
      await RannerApi.updateTrip(id, updatedTripData);
      await fetchTrip(); // Fetch the updated trip data
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update trip:', err);
      setError('Failed to update trip.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!trip) return <div>No trip found.</div>;

  return (
    <div>
      {isEditing ? (
        <TripForm
          initialData={trip}
          onSubmit={handleUpdate}
          isEdit={true}
        />
      ) : (
        <>
          <h2>{trip.name}</h2>
          <p>Origin: {trip.origin}</p>
          <p>Destination: {trip.destination}</p>
          <p>Start Date: {new Date(trip.startDate).toLocaleDateString()}</p>
          <p>End Date: {new Date(trip.endDate).toLocaleDateString()}</p>
          <p>Passengers: {trip.passengers}</p>
          {currentUser && (
            <div>
              <button onClick={handleEdit}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TripDetailEdit;