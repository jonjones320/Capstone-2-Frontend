import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RannerApi from '../../api';

function TripDetail() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    async function fetchTrip() {
      const trip = await RannerApi.getTrip(id);
      console.log("TripDetail.jsx - fetchTrip - TRIP: ", trip)
      setTrip(trip);
    }
    fetchTrip();
  }, [id]);

  if (!trip) return <div>Loading...</div>;

  return (
    <div className="TripDetail">
      <h2>{trip.name}</h2>
      <p>Location: {trip.location}</p>
      <p>Start Date: {new Date(trip.startDate).toLocaleDateString()}</p>
      <p>End Date: {new Date(trip.endDate).toLocaleDateString()}</p>
      <p>Budget: ${trip.budget}</p>
    </div>
  );
}

export default TripDetail;