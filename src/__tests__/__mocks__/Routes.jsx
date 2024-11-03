import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../../components/Home';
import Login from '../../components/Login';
import Signup from '../../components/Signup';

// Simplified mock of routes for testing.
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export default AppRoutes;