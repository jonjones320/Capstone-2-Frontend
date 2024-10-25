import React from 'react';
import { Card, Alert } from 'react-bootstrap';

function UserCard({ username, firstName, lastName, email }) {
  if (!username) {
    return (
      <Alert variant="warning">
        User information unavailable
      </Alert>
    );
  }

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title className="mb-3">{username}</Card.Title>
        <Card.Text as="div">
          <div className="mb-2">
            {firstName && lastName ? (
              <span>{firstName} {lastName}</span>
            ) : (
              <span className="text-muted">Name not provided</span>
            )}
          </div>
          <div>
            {email ? (
              <a href={`mailto:${email}`} className="text-decoration-none">
                {email}
              </a>
            ) : (
              <span className="text-muted">Email not provided</span>
            )}
          </div>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default UserCard;