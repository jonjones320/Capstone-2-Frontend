import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';


function Logout() {
  const { logout } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const performLogout = async () => {
      setIsLoading(true);
      try {
        await logout();
      } catch (err) {
        setError(err?.message || 'Logout failed');
      } finally {
        setIsLoading(false);
      }
    };

    performLogout();
  }, [logout]);

  if (isLoading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-5 text-center">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h1 className="mb-4">Thanks for coming!</h1>
          
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          <div className="mt-4">
            <Link to="/login" className="me-2">
              <Button variant="primary">Login</Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline-primary">Sign Up</Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Logout;