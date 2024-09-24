import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';

function Logout() {
  const { logout } = useContext(AuthContext);
  const [error, setError] = useState(null);

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
      } catch (error) {
        setError('There was an error logging out. Please try again.');
      }
    };

    performLogout();
  }, [logout]);

  return (
    <Container className="mt-5 text-center">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h1 className="mb-4">Thanks for coming!</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          <Link to="/login" className="me-2">
            <Button variant="primary">Login</Button>
          </Link>
          <Link to="/signup">
            <Button variant="outline-primary">Sign Up</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}

export default Logout;