import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import RannerApi from '../../api';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';

function SignUp() {
  const [formData, setFormData] = useState({
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
    });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(data => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await RannerApi.signUp(formData);
      await login(formData);
      navigate("/");
    } catch (err) {
      setError(err);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h1 className="text-center mb-4">Sign Up</h1>
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
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Sign Up
            </Button>
            {error && <Alert variant="danger" className="mt-3">{error.message}</Alert>}
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default SignUp;