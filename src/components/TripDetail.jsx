import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Spinner } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';
import RannerApi from '../../api';
import FlightCard from './FlightCard';
import TripForm from './TripForm';
import { useErrorHandler } from '../utils/errorHandler';
import ErrorDisplay from './ErrorAlert';

function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [trip, setTrip] = useState(null);
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { error, handleError, clearError } = useErrorHandler();

  // Fetches Trip details and Flights associated with that trip.
  useEffect(() => {
    const fetchTripAndFlights = async () => {
      setIsLoading(true);
      try {
        const fetchedTrip = await RannerApi.getTripById(id);
        setTrip(fetchedTrip);
        const fetchedFlights = await RannerApi.getFlightsByTrip(id);
        setFlights(fetchedFlights);
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTripAndFlights();
  }, [id]);

  // Handle Trip section //
  const handleUpdate = async (updatedTripData) => {
    setIsLoading(true);
    try {
      await RannerApi.updateTrip(id, updatedTripData);
      const updatedTrip = await RannerApi.getTripById(id);
      setTrip(updatedTrip);
      setIsEditing(false);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await RannerApi.deleteTrip(id, currentUser.username);
      navigate('/trips');
    } catch (err) {
      handleError(err);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  // Handle Flight section //
  const handleChangeFlights = () => {
    navigate('/flights', { state: { trip } });
  };

  const handleRemoveFlight = async (flightId) => {
      setFlights(flights.filter(flight => flight.id !== flightId));
  };
  
  // Go back //
  const handleBack = () => {
    navigate(-1);
  };

  // Loading JSX display //
  if (isLoading) return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Container>
  );

  if (!trip) return (
    <Container className="mt-5">
      <ErrorDisplay 
        error={new Error("Trip not found")} 
        onClose={() => navigate('/trips')} 
      />
    </Container>
  );

  // Main display - includes editing and viewing //
  return (
    <Container className="mt-5">
      <Button variant="secondary" onClick={handleBack} className="mb-3">
        &larr; Back
      </Button>
      <ErrorDisplay error={error} onClose={clearError} />
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