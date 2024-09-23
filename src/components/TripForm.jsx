import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import RannerApi from '../../api';


function TripForm({ initialData, onSubmit, isEdit = false }) {
  const [formData, setFormData] = useState({
    name: '',
    origin: '',
    destination: '',
    startDate: '',
    endDate: '',
    passengers: 1,
  });
  const [error, setError] = useState(null);
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);


  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        origin: initialData.origin || '',
        destination: initialData.destination || '',
        startDate: initialData.startDate ? format(new Date(initialData.startDate), 'yyyy-MM-dd') : '',
        endDate: initialData.endDate ? format(new Date(initialData.endDate), 'yyyy-MM-dd') : '',
        passengers: initialData.passengers || 1,
      });
    }
  }, [initialData]);

  const handleChange = async ({ target: { name, value } }) => {
    setFormData(data => ({ ...data, [name]: value }));

    if (name === 'origin' && value.length >= 3) {
      const res = await RannerApi.getAirportSuggestions(value);
      setOriginSuggestions(res);
    } else if (name === 'destination' && value.length >= 3) {
      const res = await RannerApi.getAirportSuggestions(value);
      setDestinationSuggestions(res);
    }
  };

  const handleSuggestionClick = (name, iataCode) => {
    setFormData(data => ({ ...data, [name]: iataCode }));
    if (name === 'origin') {
      setOriginSuggestions([]);
    } else if (name === 'destination') {
      setDestinationSuggestions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.origin.length > 100 || formData.destination.length > 100 || formData.name.length > 50) {
      setError('Location must be less than 101 characters and Name must be less than 51 characters.');
      return;
    };

    const dataToSubmit = { 
      ...formData, 
      startDate: format(new Date(formData.startDate), 'yyyy-MM-dd'),
      endDate: format(new Date(formData.endDate), 'yyyy-MM-dd'),
      passengers: parseInt(formData.passengers, 10),
    };

    onSubmit(dataToSubmit);
  };


  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}

      <div>
        <label htmlFor="name">Trip Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="origin">Origin:</label>
        <input
          type="text"
          id="origin"
          name="origin"
          value={formData.origin}
          onChange={handleChange}
          required
        />
        <ul>
          {originSuggestions.map(suggestion => (
            <li key={suggestion.id} onClick={() => handleSuggestionClick('origin', suggestion.iataCode)}>
              {suggestion.name} ({suggestion.iataCode})
            </li>
          ))}
        </ul>
      </div>

      <div>
        <label htmlFor="destination">Destination:</label>
        <input
          type="text"
          id="destination"
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          required
        />
        <ul>
          {destinationSuggestions.map(suggestion => (
            <li key={suggestion.id} onClick={() => handleSuggestionClick('destination', suggestion.iataCode)}>
              {suggestion.name} ({suggestion.iataCode})
            </li>
          ))}
        </ul>
      </div>
      <div>
        <label htmlFor="startDate">Departure Date:</label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="endDate">Return Date:</label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="passengers">Passengers:</label>
        <input
          type="number"
          id="passengers"
          name="passengers"
          value={formData.passengers}
          onChange={handleChange}
          min="1"
          required
        />
      </div>
      <button type="submit">{isEdit ? 'Update Trip' : 'Create Trip'}</button>
    </form>
  );
}

export default TripForm;