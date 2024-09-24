import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function TripCard({ id, name, origin, destination, startDate, endDate }) {
  return (
    <Card key={id}>
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>
          <strong>Origin:</strong> {origin}<br />
          <strong>Destination:</strong> {Destination}<br />
          <strong>Dates:</strong> {startDate} - {endDate}
        </Card.Text>
        <Link to={`/trip/${id}`} className="btn btn-primary btn-sm">View Details</Link>
      </Card.Body>
    </Card>
  );
}

export default TripCard;