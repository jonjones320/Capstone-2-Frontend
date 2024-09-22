import React from 'react';
import { Link } from 'react-router-dom';

function TripCard({ id, name, origin, destination, startDate, endDate }) {
  return (
    <div className="TripCard" key={id}>
      <h3>{name}</h3>
      <p>Origin: {origin}</p>
      <p>Destination: {destination}</p>
      <p>Start Date: {new Date(startDate).toLocaleDateString()}</p>
      <p>End Date: {new Date(endDate).toLocaleDateString()}</p>
      <Link to={`/trips/${id}`}>View Details</Link>
    </div>
  );
}

export default TripCard;