import { useContext } from 'react';
import AuthContext from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Logout from './components/Logout';
import Signup from './components/Signup';
import TripForm from './components/TripForm';
import TripList from './components/TripList';
import TripDetail from './components/TripDetail';
import Profile from './components/Profile';
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
      <Route path="/trip" element={<ProtectedRoute element={<TripForm />} />} />
      <Route path="/trips" element={<ProtectedRoute element={<TripList />} />} />
      <Route path="/trips/:id" element={<ProtectedRoute element={<TripDetail />} />} />
      <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
