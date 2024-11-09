import React from 'react';
import TripCard from './TripCard';
import UserCard from './UserCard';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useErrorHandler } from '../utils/errorHandler';
import ErrorAlert from './ErrorAlert';

function ProfileView({ user, trips, isLoading }) {
  const { error, handleError, clearError } = useErrorHandler();

  if (isLoading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading profile...</span>
        </Spinner>
      </div>
    );
  }

  if (!user) {
    return (
      <Alert variant="warning">
        <Alert.Heading>Profile Unavailable</Alert.Heading>
        <p>Unable to load user details. Please try again later.</p>
      </Alert>
    );
  }

  const handleTripError = (err) => {
    handleError(err);
  };
  
  return (
    <div>
      <h1 className="mb-4">{user.username}'s Profile</h1>
      <ErrorAlert 
        error={typeof error === 'string' ? error : error?.message} 
        onDismiss={clearError}
      />
      <Row>
        <Col md={4}>
          <UserCard 
            username={user.username}
            firstName={user.firstName}
            lastName={user.lastName}
            email={user.email}
          />
        </Col>
        <Col md={8}>
          <h2 className='mb-3'>My Trips</h2>
          {trips.length === 0 ? (
            <Alert variant="info">
              No trips found. Start planning your next adventure!
            </Alert>
          ) : (
            <Row>
              {trips.map(trip => (
                <Col md={6} key={trip.tripId} className="mb-3">
                  <TripCard
                    id={trip.tripId}
                    name={trip.name || 'Name unavailable'}
                    origin={trip.origin || 'Origin unavailable'}
                    destination={trip.destination || 'Destination unavailable'}
                    startDate={trip.startDate}
                    endDate={trip.endDate}
                    onError={handleTripError}
                  />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default ProfileView;