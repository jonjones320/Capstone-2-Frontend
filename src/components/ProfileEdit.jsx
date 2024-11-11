import React, { useState, useEffect } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import RannerApi from '../../api';
import { ErrorHandler, useErrorHandler, ValidationError } from '../utils/errorHandler';
import ErrorAlert from './ErrorAlert';

function ProfileEdit({ user, onUpdate }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { error, handleError, clearError } = useErrorHandler();

  useEffect(() => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      currentPassword: '',
      password: ''
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(data => ({ ...data, [name]: value }));
    clearError();
  };

  const validateForm = () => {
    // Email validation.
    if (!formData.email.includes('@')) {
      handleError(new ValidationError('Please enter a valid email address'));
      return false;
    }
    
    // Password validation.
    if (formData.password && !formData.currentPassword) {
      handleError(new ValidationError('Please enter your current password'));
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const dataToUpdate = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      };
      
      // Only include password fields if both are filled out.
      if (formData.currentPassword && formData.password) {
        dataToUpdate.password = formData.password;
        dataToUpdate.currentPassword = formData.currentPassword;
      }

      const updatedUser = await RannerApi.patchUser(user.username, dataToUpdate);
      onUpdate(updatedUser);
    } catch (err) {
      handleError(err?.response?.data?.error?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h3 className="mb-4">Edit Profile</h3>
      <ErrorAlert 
        error={error} 
        onDismiss={clearError}
      />
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>First Name:</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            aria-label="First name"
            disabled={isLoading}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Last Name:</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            aria-label="Last name"
            disabled={isLoading}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            aria-label="Email address"
            disabled={isLoading}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Current Password</Form.Label>
          <Form.Control
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            aria-label="Current password"
            disabled={isLoading}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label> New Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            aria-label="Password"
            disabled={isLoading}
          />
        </Form.Group>
        <Button 
          type="submit" 
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </Form>
    </div>
  );
}

export default ProfileEdit;