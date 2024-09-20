import React, { useState, useEffect } from 'react';
import RannerApi from '../../api';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function FlightList({ origin, destination, dates, passengers }) {
  const { state } = useLocation();
  const { trip } = state || {}; // Destructure new Trip from state
  const [flights, setFlights] = useState([]);
  console.log("FlightList - TRIP:", trip);

  useEffect(() => {
    const fetchFlights = async () => {
      const res = await RannerApi.searchFlightOffers({
        originLocationCode: trip.origin,
        destinationLocationCode: trip.destination,
        departureDate: trip.startDate,
        returnDate: trip.endDate,
        adults: trip.passengers,
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
