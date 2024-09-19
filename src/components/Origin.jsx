import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RannerApi from '../../api';

function Origin() {
  const [origin, setOrigin] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const handleChange = async (e) => {
    setOrigin(e.target.value);
    if (e.target.value.length >= 3) {
      const res = await RannerApi.getAirportSuggestions(e.target.value);
      setSuggestions(res);
    }
  };

  const handleSuggestionClick = (iataCode) => {
    setOrigin(iataCode);
    setSuggestions([]);
  };

  const handleNext = () => {
    navigate("/destination");
  };

  return (
    <div>
      <h2>Choose Your Starting Location</h2>
      <input
        type="text"
        placeholder="Enter city or airport"
        value={origin}
        onChange={handleChange}
      />
      <ul>
        {suggestions.map((suggestion) => (
          <li key={suggestion.iataCode} onClick={() => handleSuggestionClick(suggestion.iataCode)}>
            {suggestion.name} ({suggestion.iataCode})
          </li>
        ))}
      </ul>
      <button onClick={handleNext}>Next</button>
    </div>
  );
}

export default Origin;
