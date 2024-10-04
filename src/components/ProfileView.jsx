import React from 'react';
import TripCard from './TripCard';
import UserCard from './UserCard';
import { Row, Col } from 'react-bootstrap';

function ProfileView({ user, trips }) {
  if (!user) {
    return <p>Loading user details...</p>; // Fallback in case `user` prop is not passed.
  }
  
  return (
    <div>
      <h1 className="mb-4">{user.username}'s Profile</h1>
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
                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default ProfileView;
