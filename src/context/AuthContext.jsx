import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import RannerApi from '../../api';

// Authorization context can be accessed throughout the context of this app.
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // State management to stay up-to-date with user and token.
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    /**
     * Token management utilities 
     */

    // JWT storage maintains log in status.
    const storeToken = (newToken) => {
        localStorage.setItem('token', newToken);
        RannerApi.token = newToken;
        setToken(newToken);
    };

    // Requires log in (and new token) after cleared.
    const clearToken = () => {
        localStorage.removeItem('token');
        RannerApi.token = null;
        setToken(null);
    };

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
            clearToken();
            return null;
        }
    }

    // Set up initial authorization state from localStorage.
    useEffect(() => {
        if (token) {
            try {
                const user = getUserFromToken(token); // User data is decoded from JWT.
                if (user) {
                    RannerApi.token = token; // Token is set for use with API requests.
                    setCurrentUser(user); // Logged in.
                } else {
                    clearToken();
                }
            } catch (err) {
                console.error("Error restoring token:", err);
                clearToken();
            }
        }
    }, [token]);

    const login = async ({ username, password }) => {
        try {
            console.log("Attempting login...");
            const response = await RannerApi.login({ username, password });
            console.log("Login response:", response);
            
            // Handle both possible response formats.
            const newToken = typeof response === 'string' ? response : response.token;
            
            if (!newToken) {
                throw new Error("No token received from server");
            }

            // Uses the new token where needed for authorization.
            storeToken(newToken);
            const user = getUserFromToken(newToken);
            setCurrentUser(user);
            
        } catch (err) {
            console.error("Login error details:", err);
            clearToken();
            throw err;
        }
    };

    // Resets user state and deletes local storage token.
    const logout = () => {
        setCurrentUser(null);
        clearToken();
    };

    // Authentication wrapper for the whole app.
    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;