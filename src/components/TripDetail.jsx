import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Spinner, Alert } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';
import RannerApi from '../../api';
import FlightCard from './FlightCard';
import TripForm from './TripForm';

function TripDetail() {
  // Set intial states to use passed params and update elements.
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [trip, setTrip] = useState(null);
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  // Requests trip by trip ID and flight, by correlated trip ID, from the server. 
  const fetchTripAndFlights = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedTrip, fetchedFlights] = await Promise.all([
        RannerApi.getTripById(id),
        RannerApi.getFlightsByTrip(id)
      ]);
      setTrip(fetchedTrip);
      setFlights(fetchedFlights);
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Failed to load trip details');
    } finally {
      setIsLoading(false);
    }
  };

  // If the ID changes, new data is requested.
  useEffect(() => {
    fetchTripAndFlights();
  }, [id]);

  // Updates the trip on the server side.
  const handleUpdate = async (updatedTripData) => {
    setIsLoading(true);
    setError(null);
    try {
      await RannerApi.updateTrip(id, updatedTripData);
      const updatedTrip = await RannerApi.getTripById(id);
      setTrip(updatedTrip);
      setIsEditing(false);
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Failed to update trip');
    } finally {
      setIsLoading(false);
    }
  };

  // Deletes the trip from the server.
  const handleDelete = async () => {
    try {
      setError(null);
      await RannerApi.deleteTrip(id, currentUser.username);
      navigate('/trips');
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Failed to delete trip');
    }
  };

  // Set editing state on or off.
  const handleEdit = () => {
    setIsEditing(true);
  };

    // 'Change Flight' button triggers this redirect.
    const handleChangeFlights = () => {
      navigate('/flights', { state: { trip } });
    };

  // Loading animation with spinner.
  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  // Checks that a trip is found.
  if (!trip && !isLoading) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">
          Trip not found
          <div className="mt-2">
            <Button variant="warning" onClick={() => navigate('/trips')}>
              Return to Trips
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  /**
   * JSX
   */

  return (
    <Container className="mt-5">
      <Button variant="secondary" onClick={() => navigate(-1)} className="mb-3">
        &larr; Back
      </Button>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
          <div className="mt-2">
            <Button variant="outline-danger" size="sm" onClick={fetchTripAndFlights}>
              Try Again
            </Button>
          </div>
        </Alert>
      )}
      {isEditing ? (
        <TripForm
          initialData={trip}
          onSubmit={handleUpdate}
          isEdit={true}
        />
      ) : (
        <>
          <h2>{trip.name}</h2>
          <p>Origin: {trip.origin}</p>
          <p>Destination: {trip.destination}</p>
          <p>Start Date: {new Date(trip.startDate).toLocaleDateString()}</p>
          <p>End Date: {new Date(trip.endDate).toLocaleDateString()}</p>
          <p>Passengers: {trip.passengers}</p>
          {currentUser && (
            <div className="mb-4">
              <Button variant="primary" onClick={handleEdit} className="me-2">
                Edit Trip
              </Button>
              <Button variant="danger" onClick={handleDelete} aria-label="Delete trip">
                Delete Trip
              </Button>
            </div>
          )}
          
          <h3>Flights</h3>
          {flights.length > 0 ? (
            flights.map(flight => (
              <FlightCard 
                key={flight.id} 
                flight={flight} 
                onRemove={handleRemoveFlight} 
                username={trip.username} 
              />
            ))
          ) : (
            <p>No flights booked for this trip yet.</p>
          )}
          
          <Button variant="primary" onClick={handleChangeFlights} className="mt-3">
            {flights.length > 0 ? 'Change Flights' : 'Add Flight'}
          </Button>
        </>
      )}
    </Container>
  );
}

export default TripDetail;