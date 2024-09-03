import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext';

function SignUp() {
  const [formData, setFormData] = useState({
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
    });
  const { login } = useContext(AuthContext);
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
      navigate("/");
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
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
        <input 
          type="text" 
          name="firstName" 
          value={formData.firstName} 
          onChange={handleChange} 
          placeholder="First Name" 
          required 
        />
        <input 
          type="text" 
          name="lastName" 
          value={formData.lastName} 
          onChange={handleChange} 
          placeholder="Last Name" 
          required 
        />
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          placeholder="Email" 
          required 
        />
        <button type="submit"> Sign Up </button>
        {error && <p>{error.message}</p>}
      </form>
    </div>
  );
}

export default SignUp;
