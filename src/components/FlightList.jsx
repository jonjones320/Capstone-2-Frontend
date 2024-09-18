import React from 'react';
import { Link } from 'react-router-dom';

function FlightList({ flights }) {
  return (
    <div>
      <h2>Flight Offers</h2>
      {flights.map((flight) => (
        <div key={flight.id} className="FlightCard">
          <h3>
            {flight.itineraries[0].segments[0].departure.iataCode} 
            to 
            {flight.itineraries[0].segments[0].arrival.iataCode}
          </h3>
          <p>
            Price: 
            {flight.price.total} {flight.price.currency}
          </p>
          <Link to={`/flights/${flight.id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
}

export default FlightList;
