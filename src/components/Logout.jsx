import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';
import { useErrorHandler } from '../utils/errorHandler';
import ErrorDisplay from '../components/ErrorDisplay';

function Logout() {
  const { logout } = useContext(AuthContext);
  const { error, handleError, clearError } = useErrorHandler();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const performLogout = async () => {
      setIsLoading(true);
      try {
        await logout();
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoading(false);
      }
    };

    performLogout();
  }, [logout, handleError]);

  if (isLoading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Logging out...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="mt-5 text-center">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h1 className="mb-4">Thanks for coming!</h1>
          <ErrorDisplay error={error} onClose={clearError} />
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