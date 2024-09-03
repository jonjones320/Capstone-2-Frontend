import React, { useEffect, useState } from 'react';
import RannerApi from '../../api';
import TripCard from './TripCard';

function TripList() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    async function fetchTrips() {
      const trips = await RannerApi.getTrips();
      setTrips(trips);
    }
    fetchTrips();
  }, []);

  return (
    <div className="TripList">
      <h2>Trips</h2>
      <div>
        {trips.map(trip => (
          <TripCard
            key={trip.id}
            id={trip.id}
            name={trip.name}
            destination={trip.destination}
            startDate={trip.startDate}
            endDate={trip.endDate}
          />
        ))}
      </div>
    </div>
  );
}

export default TripList;