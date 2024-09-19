import React from 'react';

function LocationCard({ location, type }) {
  return (
    <div className="location-card">
      <h3>{type}</h3>
      <p>{location.name} ({location.iataCode})</p>
    </div>
  );
}

export default LocationCard;
