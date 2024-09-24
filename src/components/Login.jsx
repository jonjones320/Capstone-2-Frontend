import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const { login, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      navigate("/");
      console.log("Log in successful. Welcome!");
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(data => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
    } catch (err) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h1 className="text-center mb-4">Login</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;