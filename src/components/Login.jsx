import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const { login, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(data => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      if (currentUser) {
        navigate("/");
        console.log("Log in successful. Welcome!");
      } else {
        setError("Invalid login details. Please try again.");
      };
    } catch (err) {
      setError(err.message || "An unexpected error occured. Please try again.");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="username" 
          value={formData.username} 
          onChange={handleChange} 
          placeholder="Username" 
          required 
        />
        <input 
          type="password" 
          name="password" 
          value={formData.password} 
          onChange={handleChange} 
          placeholder="Password" 
          required 
        />
        <button type="submit">Login</button>
        {error && <p>{error.message}</p>}
      </form>
    </div>
  );
}

export default Login;
