import React, { useState, useEffect } from 'react';
import RannerApi from '../api/RannerApi';

function FlightSearchForm({ onSearch }) {
  const [formData, setFormData] = useState({
    originLocationCode: '',
    destinationLocationCode: '',
    departureDate: '',
    returnDate: '',
    adults: 1,
  });

  const [suggestiong, setSuggestions] = useState([]);
  const [activeInput, setActiveInput] = useState(null); // Tracks which input is active.

  // Fetch airport suggestions from Amadeus API.
  const fetchSuggestions = async (query) => {
    if (query.length < 3) return; // Don't make API until input is longer than IATA code.
    try {
      const response = await RannerApi.getAirportSuggestions(query);
      setSuggestions(response);
    } catch (error) {
      console.error('Error fetching airport suggestions:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  // Only runs suggestions with origin or destination fields.
  if (name === 'originLocationCode' || name === 'destinationLocationCode') {
    setActiveInput(name);  // Track which input is active
    fetchSuggestions(value);
  }
};


  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(formData); // Pass form data to parent for search
  };

  const handleSuggestionClick = (iataCode) => {
    setFormData((data) => ({
      ...data,
      [activeInput]: iataCode,
    }));
    setSuggestions([]); // Clear suggestions
  }

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
