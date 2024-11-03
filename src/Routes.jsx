import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Logout from './components/Logout';
import Signup from './components/Signup';
import Profile from './components/Profile';
import Origin from './components/Origin';
import Destination from './components/Destination';
import TripDates from './components/TripDates';
import FlightList from './components/FlightList';
import TripForm from './components/TripForm';
import TripList from './components/TripList';
import TripDetail from './components/TripDetail';
import FlightDetail from './components/FlightDetail';
import NotFound from './components/NotFound';

function ProtectedRoute({ element }) {
  const { currentUser } = useContext(AuthContext);
  return currentUser ? element : <Navigate to='/login' />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
      <Route path="/trip" element={<ProtectedRoute element={<TripForm />} />} />
      <Route path="/trip/form/:id" element={<ProtectedRoute element={<TripForm />} />} />
      <Route path="/trips" element={<ProtectedRoute element={<TripList />} />} />
      <Route path="/trip/:id" element={<ProtectedRoute element={<TripDetail />} />} />
      <Route path="/origin" element={<ProtectedRoute element={<Origin />} />} />
      <Route path="/destination" element={<ProtectedRoute element={<Destination />} />} />
      <Route path="/dates" element={<ProtectedRoute element={<TripDates />} />} />
      <Route path="/flights" element={<ProtectedRoute element={<FlightList />} />} />
      <Route path="/flights/:id" element={<ProtectedRoute element={<FlightDetail />} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
