import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import RannerApi from '../../api';


// Creates a global context for authentication.
const AuthContext = createContext();

// The class that provides various authentication services.
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Extract a user from a JWT.
    function getUserFromToken(token) {
        try {
            const decoded = jwtDecode(token);
            return {
                username: decoded.username,
                isAdmin: decoded.isAdmin
            };
        } catch (error) {
            console.error('Token failed to decode', error);
            return null;
        }
    }

    // Use token from local storage to set the current user upon app load. 
    useEffect(() => {
        if (token) {
            RannerApi.token = token; // Set token for API requests
            const user = getUserFromToken(token);
            setCurrentUser(user); // Set current user in context
        }
    }, [token]);

    // Operates logging in between the front and backend.
    const login = async ({ username, password }) => {
        try {
          console.log("Attempting login...");
          const response = await RannerApi.login({ username, password });
          console.log("Login response:", response);
          
          if (!response.token) {
            throw new Error("No token received from server");
          }
          
        // Sets the token from the server in token state, API communications, and local storage.
          setToken(response.token);
          RannerApi.token = response.token;
          localStorage.setItem('token', response.token);
          
        // Extract user from JWT and set as current user.
          const user = getUserFromToken(response.token);
          setCurrentUser(user);
          
          return response;
        } catch (err) {
          console.error("Login error details:", err);
          throw err;
        }
      };

    // When current user is null, authentication effects reset to "not logged in" state.
    const logout = () => {
        setCurrentUser(null);
        setToken(null);
    };

    // Authentication wrapper.
    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};


export default AuthContext;
