import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TripDates({ onSetDatesAndPassengers }) {
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState(1);
  const navigate = useNavigate();

  const handleSave = () => {
    onSetDatesAndPassengers({ departureDate, returnDate, adults });
    navigate("/flights");
  };

  return (
    <div>
      <h2>Select Dates and Passengers</h2>
      <label>Departure Date</label>
      <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />
      
      <label>Return Date</label>
      <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
      
      <label>Adults</label>
      <input type="number" value={adults} onChange={(e) => setAdults(e.target.value)} min="1" />
      
      <button onClick={handleSave}>Save Trip</button>
    </div>
  );
}

export default TripDates;
