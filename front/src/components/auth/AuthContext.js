import React, { createContext, useState, useEffect } from 'react';
import UserService from '../service/UserService';

export const AuthContext = createContext();


// children: This is the content (e.g., Navbar, routes) wrapped inside the AuthProvider.
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(UserService.isAuthenticated());
    const [isAdmin, setIsAdmin] = useState(UserService.isAdmin());

    const refreshAuthState = () => {
        setIsAuthenticated(UserService.isAuthenticated());
        setIsAdmin(UserService.isAdmin());
    };

    const logout = () => {
        UserService.logout();
        refreshAuthState();
    };

    useEffect(() => {
        refreshAuthState();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, isAdmin, refreshAuthState, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
