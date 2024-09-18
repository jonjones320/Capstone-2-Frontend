import React, { useState } from 'react';

function TripFilterForm({ onFilter }) {
  const initialFilters = {
    name: '',
    location: '',
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
      <input
        type="text"
        name="name"
        placeholder="Trip Name"
        value={filters.name}
        onChange={handleChange}
      />
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={filters.location}
        onChange={handleChange}
      />
      <input
        type="date"
        name="startDate"
        value={filters.startDate}
        onChange={handleChange}
      />
      <input
        type="date"
        name="endDate"
        value={filters.endDate}
        onChange={handleChange}
      />
      <button type="submit">Filter</button>
      <button type="button" onClick={handleReset}>Reset</button>
    </form>
  );
}

export default TripFilterForm;
