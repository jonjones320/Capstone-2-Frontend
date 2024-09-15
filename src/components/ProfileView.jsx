import React from 'react';
import TripCard from './TripCard';
import UserCard from './UserCard';

function ProfileView({ user, trips }) {
  if (!user) {
    return <p>Loading user details...</p>; // Fallback in case `user` prop is not passed.
  }
  
  return (
    <div>
      <h1>{user.username}</h1>
      <div>
        <UserCard 
          username={user.username}
          firstName={user.firstName}
          lastName={user.lastName}
          email={user.email}
        />
      </div>
      <div>
        <h2 className='Profile-trips-title'>My Trips</h2>
        <ul className='Profile-trips-list'>
          {trips.map(trip => (
            <TripCard
              key={trip.tripId}
              id={trip.tripId}
              name={trip.name || 'Name unavailable'}
              location={trip.location || 'Location unavailable'}
              startDate={trip.startDate}
              endDate={trip.endDate}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ProfileView;
