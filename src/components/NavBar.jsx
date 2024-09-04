import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';


function NavBar() {
  const { currentUser } = useContext(AuthContext);
  
  if (currentUser) {
    return (
      <nav className='NavBar-user'>
        <Link to="/">Home</Link>
        <Link to="/trip">Add New Trip</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/logout">Logout</Link>
      </nav>
    );
  } else {
    return (
      <nav className='NavBar-guest'>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
      </nav>
    );
  }
}

export default NavBar;
