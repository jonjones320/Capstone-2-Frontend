import React, { useState, useEffect } from 'react';
import RannerApi from '../../api';


function FlightSearchForm({ onSearch }) {
  const [formData, setFormData] = useState({
    originLocationCode: '',
    destinationLocationCode: '',
    departureDate: '',
    returnDate: '',
    adults: 1,
  });

  const [suggestions, setSuggestions] = useState([]);
  const [activeInput, setActiveInput] = useState(null); // Tracks which input is active.
  const [query, setQuery] = useState(''); // Tracks the user's input.
  const [typingTimeout, setTypingTimeout] = useState(null); // Timeout for debounce.

  // Handles debounced fetch.
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]); // Clear suggestions if query is too short.
      return;
    };

    // Fetch airport suggestions from Amadeus API.
    const fetchSuggestions = async () => {
      try {
        const response = await RannerApi.getAirportSuggestions(query);
        setSuggestions(response);
      } catch (error) {
        console.error('Error fetching airport suggestions:', error);
      }
    };
    fetchSuggestions();
  }, [query]); // Only run when query changes.


  // Handles form input changes, specifies active input, and times debounce.
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((data) => ({
      ...data,
      [name]: value,
    }));

    // Only runs suggestions with origin or destination fields.
    if (name === 'originLocationCode' || name === 'destinationLocationCode') {
      setActiveInput(name);  // Track which input is active

      if (typingTimeout) {
        clearTimeout(typingTimeout); // Clear timeout if user is still typing.
      }

      // Set a new timeout for the debounc.
      const timeoutId = setTimeout(() => {
        setQuery(value); // Set query to user's input.
      }, 300); // 300ms debounce.

      setTypingTimeout(timeoutId); // Set the new timeout.
    }
  }


  // Pass form data to parent for search
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(formData); 
  };

  // Fills in appropriate input field when a suggestion is clicked.
  const handleSuggestionClick = (code) => {
    setFormData((data) => ({
      ...data,
      [activeInput]: code,
    }));
    setSuggestions([]); // Clear suggestions
  }

  // The form -- generates fields and loads suggestions for origin and destination. 
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="originLocationCode">Origin</label>
        <input
          type="text"
          id="originLocationCode"
          name="originLocationCode"
          value={formData.originLocationCode}
          onChange={handleChange}
          required
        />
        {activeInput === 'originLocationCode' && suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((s, index) => (
              <li key={index} onClick={() => handleSuggestionClick(s.iataCode)}>
                {s.name} ({s.iataCode})
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label htmlFor="destinationLocationCode">Destination</label>
        <input
          type="text"
          id="destinationLocationCode"
          name="destinationLocationCode"
          value={formData.destinationLocationCode}
          onChange={handleChange}
          required
        />
        {activeInput === 'destinationLocationCode' && suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((s, index) => (
              <li key={index} onClick={() => handleSuggestionClick(s.iataCode)}>
                {s.name} ({s.iataCode})
              </li>
            ))}
          </ul>
        )}
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
