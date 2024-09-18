import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RannerApi from '../../api';
import AuthContext from '../context/AuthContext';

function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    async function fetchTrip() {
      try {
        const trip = await RannerApi.getTripById(id);
        setTrip(trip);
      } catch (err) {
        console.error('Failed to fetch trip:', err);
        setTrip(null);
      }
  }
    fetchTrip();
  }, [id]);

  const handleDelete = async () => {
    try {
      await RannerApi.deleteTrip(id);
      navigate('/trips');
    } catch (err) {
      console.error('Failed to delete trip:', err);
    }
  };

  if (trip === null) return <div>Loading...</div>;
  if (!trip) return <div>Error loading trip details.</div>;


  return (
    <div className="TripDetail">
      <h2>{trip.name}</h2>
      <p>Location: {trip.location}</p>
      <p>Start Date: {new Date(trip.startDate).toLocaleDateString()}</p>
      <p>End Date: {new Date(trip.endDate).toLocaleDateString()}</p>
      <p>Budget: ${trip.budget}</p>
      {currentUser && (
        <div>
          <button onClick={() => navigate(`/trip/${id}`)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default TripDetail;