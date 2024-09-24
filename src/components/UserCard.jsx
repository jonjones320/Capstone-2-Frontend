import React from 'react';
import { Card } from 'react-bootstrap';

function UserCard({ username, firstName, lastName, email }) {
  return (
    <Card>
      <Card.Body>
        <Card.Title>{username}</Card.Title>
        <Card.Text>
          <p>{firstName} {lastName}</p>
          <p>{email}</p>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default UserCard;