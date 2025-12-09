// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'; // Import Toaster
import { XCircle, Loader2 } from 'lucide-react'; // Import icons
import { useAuth } from '../context/AuthContext';

// Import your custom CSS file
import './Login.css'; 


const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Destructure authState, login, and error (from authState, if available)
    const { authState, login } = useAuth();
    const navigate = useNavigate();

    // Effect to display toast on login error
    useEffect(() => {
        if (authState.error) {
            toast.error(authState.error, {
                icon: <XCircle color="#ff7f50" />,
            });
        }
    }, [authState.error]); // Run whenever the error state changes

    // Redirect if already authenticated
    if (authState.isAuthenticated) {
        // Use Navigate for declarative redirection
        return <Navigate to="/dashboard/users" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // The login function in AuthContext should handle setting authState.error
        const success = await login(email, password);
        if (success) {
            navigate('/dashboard/users'); // Go to the main user page on success
        }
    };

    return (
        <div className="login-container">
            {/* 1. Add Toaster for notifications */}
            <Toaster 
                position="top-center"
                toastOptions={{
                    style: {
                        background: '#2c2c45', 
                        color: '#e0e0f0',      
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                        border: '1px solid #4a4a6b',
                    },
                }}
            />

            {/* 2. Apply styling class names to the login card */}
            <div className="login-card">
                <h2>Admin Login 🔐</h2>
                
                <form onSubmit={handleSubmit}>
                    
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            className="form-input" // Use a class for input styling
                            type="email" 
                            id="email"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Admin Email" 
                            required 
                            disabled={authState.loading}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            className="form-input" // Use a class for input styling
                            type="password" 
                            id="password"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Password" 
                            required 
                            disabled={authState.loading}
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="submit-button" // Use class for button styling
                        disabled={authState.loading}
                    >
                        {authState.loading ? (
                            <>
                                <Loader2 size={16} className="spinner" style={{ marginRight: '8px' }} /> 
                                Logging In...
                            </>
                        ) : (
                            'Log In'
                        )}
                    </button>
                </form>

                {/* NOTE: We now rely on the toast for error display, but keeping a dedicated message area is optional */}
                {/* {authState.error && <p className="error-message">Error: {authState.error}</p>} */}
            </div>
        </div>
    );
};

export default LoginPage;