import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RannerApi from '../../api';
import FlightCard from './FlightCard';
import TripForm from './TripForm';
import AuthContext from '../context/AuthContext';
import { Container, Button, Alert, Spinner } from 'react-bootstrap';

function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [trip, setTrip] = useState(null);
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchTripAndFlights = async () => {
      setIsLoading(true);
      try {
        const fetchedTrip = await RannerApi.getTripById(id);
        setTrip(fetchedTrip);
        const fetchedFlights = await RannerApi.getFlightsByTrip(id);
        setFlights(fetchedFlights);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch trip and flights:', err);
        setError('Failed to load trip details and flights.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTripAndFlights();
  }, [id]);

  const handleDelete = async () => {
    try {
      await RannerApi.deleteTrip(id);
      navigate('/trips');
    } catch (err) {
      console.error('Failed to delete trip:', err);
      setError('Failed to delete trip.');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = async (updatedTripData) => {
    setIsLoading(true);
    try {
      await RannerApi.updateTrip(id, updatedTripData);
      const updatedTrip = await RannerApi.getTripById(id);
      setTrip(updatedTrip);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update trip:', err);
      setError('Failed to update trip.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeFlights = () => {
    navigate('/flights', { state: { trip } });
  };

  if (isLoading) return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Container>
  );
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!trip) return <Alert variant="info">No trip found.</Alert>;

  return (
    <Container className="mt-5">
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
              <Button variant="primary" onClick={handleEdit} className="me-2">Edit</Button>
              <Button variant="danger" onClick={handleDelete}>Delete</Button>
            </div>
          )}
          
          <h3>Flights</h3>
          {flights.length > 0 ? (
            flights.map(flight => (
              <FlightCard key={flight.flightDetails.id} flight={flight.flightDetails} />
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