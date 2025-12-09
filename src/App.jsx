// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import UserManagement from './pages/UserManagement';

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Public Route for Admin Login */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Protected Routes for the Admin Dashboard */}
                    <Route 
                        path="/dashboard/users" 
                        element={
                            <ProtectedRoute>
                                <UserManagement />
                            </ProtectedRoute>
                        } 
                    />
                    
                    {/* Redirects */}
                    <Route path="/" element={<Navigate to="/dashboard/users" />} />
                    <Route path="*" element={<h1>404 | Not Found</h1>} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;