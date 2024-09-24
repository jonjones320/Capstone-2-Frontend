import React, { useState, useEffect } from 'react';
import RannerApi from '../../api';
import { Form, Button, Alert } from 'react-bootstrap';

function ProfileEdit({ user, onUpdate }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || ''
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await RannerApi.patchUser(user.username, formData);
      onUpdate(formData); // Pass updated data to parent.
    } catch (err) {
      setError('There was an error updating your profile. Please try again.');
    }
  };

  return (
    <div>
      <h3 className="mb-4">Edit Profile</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>First Name:</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Last Name:</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </Form.Group>
        <Button type="submit" variant="primary">Save Changes</Button>
      </Form>
    </div>
  );
}

export default ProfileEdit;
