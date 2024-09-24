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
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await RannerApi.getUser(currentUser.username);
        const userTrips = await RannerApi.getTripsByUsername(currentUser.username);

        setUser(userData);
        setTrips(userTrips || []);

      } catch (err) {
        setError('There was an error fetching your profile information.');
      }
    }
    if (currentUser) {
      fetchUser();
    }
  }, [currentUser]);

  const toggleEdit = () => setIsEditing(!isEditing);

  const handleUpdate = (updatedData) => {
    setUser({ ...user, ...updatedData });
    setIsEditing(false); 
  };

  // Check if there is an error before rendering the view.
  if (error) return <p>{error}</p>;

  // Check if the user data has been fetched before rendering the view.
  if (!user) {
    return <p>Loading profile...</p>;
  }

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
