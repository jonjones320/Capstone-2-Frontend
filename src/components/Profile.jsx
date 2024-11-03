import React, { useState, useContext, useEffect } from 'react';
import { Container, Button, Spinner } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import RannerApi from '../../api';
import ProfileView from './ProfileView';
import ProfileEdit from './ProfileEdit';
import { useErrorHandler } from '../utils/errorHandler';
import ErrorDisplay from './ErrorAlert';

function Profile() {
  const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { error, handleError, clearError } = useErrorHandler();

  useEffect(() => {
    async function fetchUser() {
      setIsLoading(true);
      try {
        const userData = await RannerApi.getUser(currentUser.username);
        const userTrips = await RannerApi.getTripsByUsername(currentUser.username);
        setUser(userData);
        setTrips(userTrips || []);
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (currentUser) {
      fetchUser();
    }
  }, [currentUser]);

  const handleUpdate = async (formData) => {
    try {
      const updatedUser = await RannerApi.patchUser(currentUser.username, formData);
      setUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      handleError(err);
    }
  };

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <ErrorDisplay error={error} onClose={clearError} />
      {isEditing ? (
        <ProfileEdit user={user} onUpdate={handleUpdate} />
      ) : (
        <ProfileView user={user} trips={trips} />
      )}
      <Button onClick={() => setIsEditing(!isEditing)} variant="outline-primary" className="mt-3">
        {isEditing ? 'Cancel' : 'Edit Profile'}
      </Button>
    </Container>
  );
}


export default Profile;
