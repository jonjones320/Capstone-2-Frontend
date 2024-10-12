import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import RannerApi from '../../api';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    function getUserFromToken(token) {
        try {
            const decoded = jwtDecode(token);
            return decoded;
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

    const login = async ({ username, password }) => {
        try {
            const token = await RannerApi.login({ username, password });
            setToken(token);
            localStorage.setItem('token', token);
            const user = getUserFromToken(token);
            setCurrentUser(user);
        } catch (err) {
            console.error("Login error: ", err);
            throw new Error(err.response?.data?.error || "Invalid username or password");
        }
    };

    const logout = () => {
        setCurrentUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
