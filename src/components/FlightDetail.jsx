import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RannerApi from '../../api';

function FlightDetail() {
  const { id } = useParams();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFlightDetails = async () => {
      setLoading(true);
      try {
        const result = await RannerApi.getFlight(id);
        setFlight(result);
      } catch (err) {
        console.error("Error fetching flight details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlightDetails();
  }, [id]);

  if (loading) return <p>Loading flight details...</p>;
  if (!flight) return <p>No flight found.</p>;

  return (
    <div>
      <h2>Flight Details</h2>
      <p>From: {flight.itineraries[0].segments[0].departure.iataCode}</p>
      <p>To: {flight.itineraries[0].segments[0].arrival.iataCode}</p>
      <p>Price: {flight.price.total} {flight.price.currency}</p>
    </div>
  );
}

export default FlightDetail;
