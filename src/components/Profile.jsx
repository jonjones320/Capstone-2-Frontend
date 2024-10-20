import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import RannerApi from '../../api';
import ProfileView from './ProfileView';
import ProfileEdit from './ProfileEdit';
import { Container, Button, Alert } from 'react-bootstrap';


function Profile() {
  const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      setIsLoading(true);
      try {
        const userData = await RannerApi.getUser(currentUser.username);
        const userTrips = await RannerApi.getTripsByUsername(currentUser.username);

        setUser(userData);
        setTrips(userTrips || []);

      } catch (err) {
        setError('There was an error fetching your profile information.');
      } finally {
        setIsLoading(false);
      }
    }
    if (currentUser) {
      fetchUser();
    }
  }, [currentUser]);

  const toggleEdit = () => setIsEditing(!isEditing);

  const handleUpdate = (updatedData) => {
    setIsLoading(true);
    try {
      setUser({ ...user, ...updatedData });
      setIsEditing(false); 
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading spinner JSX.
  if (isLoading) return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Container>
  );
  // Check if there is an error before rendering the view.
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!user) return <Alert variant="info">No user found.</Alert>;


  return (
    <Container className="mt-5">
      {isEditing ? (
        <ProfileEdit user={user} onUpdate={handleUpdate} />
      ) : (
        <ProfileView user={user} trips={trips} />
      )}
      <Button onClick={toggleEdit} variant="outline-primary" className="mt-3">
        {isEditing ? 'Cancel' : 'Edit Profile'}
      </Button>
    </Container>
  );
}

export default Profile;
