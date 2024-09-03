import React from 'react';
import { Link } from 'react-router-dom';

function TripCard({ id, name, destination, startDate, endDate }) {
  return (
    <div className="TripCard">
      <h3>{name}</h3>
      <p>Destination: {destination}</p>
      <p>Start Date: {new Date(startDate).toLocaleDateString()}</p>
      <p>End Date: {new Date(endDate).toLocaleDateString()}</p>
      <Link to={`/trips/${id}`}>View Details</Link>
    </div>
  );
}

export default TripCard;