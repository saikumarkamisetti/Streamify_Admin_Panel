// src/context/AuthContext.jsx
import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

 // Adjust if your setup is different

export const AuthProvider = ({ children }) => {
    // Check local storage for initial state
    const [authState, setAuthState] = useState({
        token: localStorage.getItem('adminToken') || null,
        role: localStorage.getItem('adminRole') || null,
        isAuthenticated: !!localStorage.getItem('adminToken'),
        error: null,
        loading: false,
    });

    const login = async (email, password) => {
        setAuthState(prev => ({ ...prev, loading: true, error: null }));
        try {
            // Your adminLogin endpoint is POST /api/admin/valid
            const response = await axios.post(`http://localhost:5001/api/admin/valid`, { email, password });
            
            const { token, role } = response.data;

            // Save state and local storage
            localStorage.setItem('adminToken', token);
            localStorage.setItem('adminRole', role);
            
            setAuthState({ 
                token, 
                role, 
                isAuthenticated: true, 
                loading: false, 
                error: null 
            });
            return true;
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Login failed. Check server status.';
            setAuthState(prev => ({ ...prev, loading: false, error: errorMsg }));
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminRole');
        setAuthState({ token: null, role: null, isAuthenticated: false, loading: false, error: null });
    };

    return (
        <AuthContext.Provider value={{ authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);