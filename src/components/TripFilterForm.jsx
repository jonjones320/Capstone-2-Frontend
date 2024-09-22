import React, { useState } from 'react';

function TripFilterForm({ onFilter }) {
  const initialFilters = {
    name: '',
    origin: '',
    destination: '',
    startDate: '',
    endDate: ''
  };
  const [filters, setFilters] = useState(initialFilters);

  // Handle input changes and update the filter state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({
      ...f,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);  // Send filters to parent component
  };

  // Handle reset filters
  const handleReset = () => {
    setFilters(initialFilters);
    onFilter(initialFilters);  // Send empty filters to parent component
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input
        type="text"
        name="name"
        placeholder="Trip Name"
        value={filters.name}
        onChange={handleChange}
      />
      <label htmlFor="origin">Origin</label>
      <input
        type="text"
        name="origin"
        placeholder="Origin"
        value={filters.origin}
        onChange={handleChange}
      />
      <label htmlFor="destination">Destination</label>
      <input
        type="text"
        name="destination"
        placeholder="Destination"
        value={filters.destination}
        onChange={handleChange}
      />
      <label htmlFor="startDate">Start Date</label>
      <input
        type="date"
        name="startDate"
        value={filters.startDate}
        onChange={handleChange}
      />
      <label htmlFor="endDate">End Date</label>
      <input
        type="date"
        name="endDate"
        value={filters.endDate}
        onChange={handleChange}
      />
      <label htmlFor="passengers">Passengers</label>
      <input
        type="number"
        name="passengers"
        value={filters.passengers}
        onChange={handleChange}
      />
      <button type="submit">Filter</button>
      <button type="button" onClick={handleReset}>Reset</button>
    </form>
  );
}

export default TripFilterForm;
