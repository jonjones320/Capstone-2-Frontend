import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import RannerApi from '../../api';
import AuthContext from '../context/AuthContext';

function TripForm() {
  const navigate = useNavigate();
  const { id : tripId} = useParams();
  const { currentUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    location: '',
    startDate: '',
    endDate: '',
    budget: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (tripId) {
      async function fetchTrip() {
      setIsLoading(true);
      try {
        const trip = await RannerApi.getTripById(tripId);
        setFormData({
          name: trip.name,
          username: currentUser.username,
          location: trip.location,
          startDate: format(new Date(trip.startDate), 'yyyy-MM-dd'),
          endDate: format(new Date(trip.endDate), 'yyyy-MM-dd'),
          budget: trip.budget
        });
      } catch (err) {
        setError(err || 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    }
      fetchTrip();
    }
  }, [tripId, currentUser]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData(data => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.location.length > 100 || formData.name.length > 50) {
      setError('Location must be less than 101 characters and Name must be less than 51 characters.');
      return;
    };

    try {
      const dataToSubmit = { 
        ...formData, 
        username: currentUser.username,
        budget: parseFloat(formData.budget),
        startDate: format(new Date(formData.startDate), 'yyyy-MM-dd'),
        endDate: format(new Date(formData.endDate), 'yyyy-MM-dd'),
      };

      if (tripId) {
        await RannerApi.updateTrip(tripId, dataToSubmit);
        navigate(`/trips/${tripId}`);
      } else {
        const newTrip = await RannerApi.postTrip(dataToSubmit);
        navigate(`/trips/${newTrip.trip.tripId}`);
      }
    } catch (err) {
      setError(err || 'Something went wrong');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{tripId ? 'Edit Trip' : 'New Trip'}</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
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
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="startDate">Start Date:</label>
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
          <label htmlFor="endDate">End Date:</label>
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
          <label htmlFor="budget">Budget:</label>
          <input
            type="number"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{tripId ? 'Update Trip' : 'Create Trip'}</button>
      </form>
    </div>
  );
}

export default TripForm;