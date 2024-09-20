import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { format } from 'date-fns';
import RannerApi from '../../api';

function TripDates() {
  const { currentUser } = useContext(AuthContext);
  const { state } = useLocation();
  const { origin, destination } = state || {}; // Destructure origin and destination from state.
  const [name, setName] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setpassengers] = useState(1);
  const navigate = useNavigate();

  const createTrip = (name, origin, destination, departureDate, returnDate, passengers) => {
    const newTrip = {
        name: name,
        username: currentUser.username,
        origin: origin,
        destination: destination,
        startDate: format(new Date(departureDate), 'yyyy-MM-dd'),
        endDate: format(new Date(returnDate), 'yyyy-MM-dd'),
        passengers: passengers
    };
    console.log("TripDates - createTrip - newTrip:", newTrip);

    RannerApi.postTrip(newTrip);
    return newTrip;
  }

  const handleSave = () => {
    const trip = createTrip(name, origin, destination, departureDate, returnDate, passengers);
    console.log("TripDates - handleSave - trip:", trip);
    navigate("/flights");
  };

  return (
    <div>
      <h2>Select Dates and Passengers</h2>
      <label>Trip Name</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Our Vacation" />

      <label>Departure Date</label>
      <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />
      
      <label>Return Date</label>
      <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
      
      <label>Passengers</label>
      <input type="number" value={passengers} onChange={(e) => setpassengers(e.target.value)} min="1" />
      
      <button onClick={handleSave}>Save Trip</button>
    </div>
  );
}

export default TripDates;
