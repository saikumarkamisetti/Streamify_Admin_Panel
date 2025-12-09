// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { authState } = useAuth();

    if (!authState.isAuthenticated) {
        // Redirect them to the /login page, but save the current location 
        // they were trying to go to
        return <Navigate to="/login" replace />;
    }

    // You could also add a check here for role === 'admin' 

    return children;
};

export default ProtectedRoute;