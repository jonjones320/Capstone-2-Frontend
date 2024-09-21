import React, { useState, useEffect } from 'react';
import RannerApi from '../../api';
import { useLocation } from 'react-router-dom';
import FlightCard from './FlightCard';

function FlightList() {
  const { state } = useLocation();
  const { trip } = state || {}; // Destructure new Trip from state
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await RannerApi.searchFlightOffers({
          originLocationCode: trip.origin,
          destinationLocationCode: trip.destination,
          departureDate: trip.startDate,
          returnDate: trip.endDate,
          adults: trip.passengers,
        });
        setFlights(res.data);
      } catch (err) {
        console.error("Error fetching flights:", err);
        setError("Unable to fetch flights. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (trip) {
      fetchFlights();
    }
  }, [trip]);


  if (isLoading) { 
    return ( <div><p>Loading flights...</p></div> ); 
  };

  if (error) { 
    return ( <div><p>{error}</p></div> ); 
  };

  if (flights.length === 0) {
    return ( <div><p>No flights found for your search criteria. Please try different dates or locations.</p></div> );
  }

  return (
    <div>
      <h2>Flight Offers</h2>
      {flights.map((flight) => (
        <FlightCard key={flight.id} flight={flight} />
      ))}
    </div>
  );
}


export default FlightList;
