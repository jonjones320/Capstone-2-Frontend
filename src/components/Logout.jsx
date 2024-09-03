import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext';

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
    <div>
      <h1>Thanks for coming!</h1>
      {error && <p>{error}</p>}
      <Link to="/login">
        <button type="submit">Login</button>
      </Link>
      <Link to="/signup">
        <button type="submit">Sign Up</button>
      </Link>
    </div>
  );
};

export default Logout;
