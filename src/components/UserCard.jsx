import React from 'react';
import { Link } from 'react-router-dom';

function UserCard({ username, firstName, lastName, email }) {
  return (
    <div className="UserCard">
      <h3>{username}</h3>
      <p>{firstName} {lastName}</p>
      <p>{email}</p>
      {/* <Link to={`/users/${username}`}>View Profile</Link> */}
    </div>
  );
}

export default UserCard;