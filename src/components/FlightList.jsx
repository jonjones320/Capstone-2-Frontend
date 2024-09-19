import React, { useState, useEffect } from 'react';
import RannerApi from '../../api';
import { Link } from 'react-router-dom';

function FlightList({ origin, destination, dates, passengers }) {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    const fetchFlights = async () => {
      const res = await RannerApi.searchFlightOffers({
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate: dates.departureDate,
        returnDate: dates.returnDate,
        adults: passengers,
      });
      setFlights(res.data);
    };
    fetchFlights();
  }, [origin, destination, dates, passengers]);


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
