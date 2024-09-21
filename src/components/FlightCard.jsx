import React from 'react';
import { Link } from 'react-router-dom';

const FlightCard = ({ flight }) => {
  const departureSegment = flight.itineraries[0].segments[0];
  const arrivalSegment = flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1];

  return (
    <div>
      <div>
        <h3>
          {departureSegment.departure.iataCode} to {arrivalSegment.arrival.iataCode}
        </h3>
        <span>
          {flight.validatingAirlineCodes[0]}
        </span>
      </div>
      <div>
        <div>
          <p>Departure</p>
          <p>{new Date(departureSegment.departure.at).toLocaleString()}</p>
        </div>
        <div>
          <p>Arrival</p>
          <p>{new Date(arrivalSegment.arrival.at).toLocaleString()}</p>
        </div>
      </div>
      <div>
        <p>
          Duration: 
          {flight.itineraries[0].duration.replace('PT', '')}
        </p>
        <p>
          Stops: 
          {flight.itineraries[0].segments.length - 1}
        </p>
      </div>
      <div>
        <p>
          {flight.price.total} {flight.price.currency}
        </p>
        <Link to={`/flights/${flight.id}`}>
          View Details
        </Link>
      </div>
    </div>
  );
};

export default FlightCard;