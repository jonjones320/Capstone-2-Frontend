import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import JoblyApi from '../../api';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            JoblyApi.token = token;
        }
    }, [token]);

    function getUserFromToken(token) {
        try {
            const decoded = jwtDecode(token);
            return decoded;
        } catch (error) {
            console.error('Token failed to decode', error);
            return null;
        };
    }

    const login = async ({ username, password }) => {
        try {
            const token = await JoblyApi.login({ username, password });
            setToken(token);
            localStorage.setItem('token', token);
            const user = getUserFromToken(token);
            setCurrentUser(user);
        } catch (err) {
            console.error("Login error: ", err);
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
