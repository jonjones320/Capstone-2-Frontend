import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RannerApi from '../../api';

function Destination({ origin, onSetDestination }) {
  const [destination, setDestination] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [inspirations, setInspirations] = useState([]);
  const navigate = useNavigate();

  const handleChange = async (e) => {
    setDestination(e.target.value);
    if (e.target.value.length >= 3) {
      const res = await RannerApi.getAirportSuggestions(e.target.value);
      setSuggestions(res);
    }
  };

  const handleSuggestionClick = (iataCode) => {
    onSetDestination(iataCode);
    setSuggestions([]);
  };

  const fetchInspiration = async () => {
    const res = await RannerApi.getDestinationInspiration(origin);
    setInspirations(res);
  };

  const handleNext = () => {
    navigate("/dates");
  };

  return (
    <div>
      <h2>Choose Your Destination</h2>
      <input
        type="text"
        placeholder="Enter city or airport"
        value={destination}
        onChange={handleChange}
      />
      <ul>
        {suggestions.map((suggestion) => (
          <li key={suggestion.iataCode} onClick={() => handleSuggestionClick(suggestion.iataCode)}>
            {suggestion.name} ({suggestion.iataCode})
          </li>
        ))}
      </ul>
      <button onClick={fetchInspiration}>Inspiration</button>
      <ul>
        {inspirations.map((insp) => (
          <li key={insp.destination}>
            {insp.destination} (Avg Price: {insp.price.total})
          </li>
        ))}
      </ul>
      <button onClick={handleNext}>Next</button>
    </div>
  );
}

export default Destination;
