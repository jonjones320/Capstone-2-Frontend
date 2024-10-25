import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <Container className="mt-5 text-center">
      <Alert variant="warning">
        <Alert.Heading>Page Not Found</Alert.Heading>
        <p>
          Sorry, but the page you're looking for doesn't exist or has been moved.
        </p>
        <hr />
        <div className="d-flex justify-content-center gap-2">
          <Button variant="primary" onClick={() => navigate('/')}>
            Go Home
          </Button>
          <Button variant="outline-secondary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </Alert>
    </Container>
  );
}

export default NotFound;