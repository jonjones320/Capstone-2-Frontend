import React, { useState } from 'react';
import FlightSearchForm from './FlightSearchForm';
import RannerApi from '../../api';
import FlightList from './FlightList';

function FlightSearch() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchFlights = async (formData) => {
    setLoading(true);
    try {
      const result = await RannerApi.searchFlightOffers(formData);
      setFlights(result.data); // Assuming the flight offers are returned as `data`
    } catch (err) {
      console.error("Error fetching flight offers:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Search for Flights</h1>
      <FlightSearchForm onSearch={searchFlights} />
      {loading && <p>Loading flights...</p>}
      {!loading && flights.length > 0 && <FlightList flights={flights} />}
    </div>
  );
}

export default FlightSearch;
