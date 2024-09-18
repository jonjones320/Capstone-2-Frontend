import React, { useEffect, useState } from 'react';
import RannerApi from '../../api';
import TripCard from './TripCard';
import TripFilterForm from './TripFilterForm';

function TripList() {
  const [trips, setTrips] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    async function fetchTrips() {
      const trips = await RannerApi.getTrips(filters);
      setTrips(trips);
    }
    fetchTrips();
  }, [filters]);

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  }
  
  return (
    <div className="TripList">
      <h2>Trips</h2>
      <div>
        <TripFilterForm 
        onFilter={handleFilter} 
        />
      </div>
      <div>
        {trips.map(trip => (
          <TripCard
            key={trip.tripId}
            id={trip.tripId}
            name={trip.name}
            location={trip.location}
            startDate={trip.startDate}
            endDate={trip.endDate}
          />
        ))}
      </div>
    </div>
  );
}

export default TripList;