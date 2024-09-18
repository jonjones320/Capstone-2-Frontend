import React, { useState } from 'react';

function FlightSearchForm({ onSearch }) {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    adults: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(formData); // Pass form data to parent for search
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="origin"
        placeholder="Origin (Airport Code)"
        value={formData.origin}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="destination"
        placeholder="Destination (Airport Code)"
        value={formData.destination}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="departureDate"
        placeholder="Departure Date"
        value={formData.departureDate}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="returnDate"
        placeholder="Return Date"
        value={formData.returnDate}
        onChange={handleChange}
      />
      <input
        type="number"
        name="adults"
        min="1"
        max="9"
        placeholder="Number of Adults"
        value={formData.adults}
        onChange={handleChange}
        required
      />
      <button type="submit">Search Flights</button>
    </form>
  );
}

export default FlightSearchForm;
