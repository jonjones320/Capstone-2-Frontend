import React, { useState } from 'react';

function FlightSearchForm({ onSearch }) {
  const [formData, setFormData] = useState({
    originLocationCode: '',
    destinationLocationCode: '',
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
      <div>
        <label htmlFor="originLocationCode">Origin (Airport Code)</label>
        <input
          type="text"
          id="originLocationCode"
          name="originLocationCode"
          value={formData.originLocationCode}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="destinationLocationCode">Destination (Airport Code)</label>
        <input
          type="text"
          id="destinationLocationCode"
          name="destinationLocationCode"
          value={formData.destinationLocationCode}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="departureDate">Departure Date</label>
        <input
          type="date"
          id="departureDate"
          name="departureDate"
          value={formData.departureDate}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="returnDate">Return Date</label>
        <input
          type="date"
          id="returnDate"
          name="returnDate"
          value={formData.returnDate}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="adults">Number of Adults</label>
        <input
          type="number"
          id="adults"
          name="adults"
          min="1"
          max="9"
          value={formData.adults}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit">Search Flights</button>
    </form>
  );
}

export default FlightSearchForm;
