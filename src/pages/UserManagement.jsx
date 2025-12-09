import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import UserDetailsModal from '../components/UserDetailsModel'; 
import './UserManagement.css'; 
import toast, { Toaster } from 'react-hot-toast';
import { Trash, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { authState, logout } = useAuth();
    const token = authState.token;
    const [selectedUser, setSelectedUser] = useState(null);

    const showDetails = (user) => {
        setSelectedUser(user);
    };

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:5001/api/admin/users`, {
                headers: {
                    Authorization: `Bearer ${token}` 
                },
                withCredentials: true 
            });
            
            if (Array.isArray(response.data)) {
                setUsers(response.data);
            } else {
                setError("Server returned data in an unexpected format. Check backend response.");
            }
            setLoading(false);
        } catch (err) {
            const status = err.response?.status;
            const message = err.response?.data?.message || 'Check server and authorization.';
            
            if (status === 401 || status === 403) {
                setError(`Access Denied (${status}). Logging out...`);
                logout(); 
            } else {
                setError(`Failed to retrieve user data: ${message}`);
            }
            setLoading(false);
        }
    }, [token, logout]);

    useEffect(() => {
        if (authState.isAuthenticated) {
            fetchUsers();
        }
    }, [fetchUsers, authState.isAuthenticated]);

    // src/pages/UserManagement.jsx

const handleDelete = async (userId, fullName) => {
    const nameToConfirm = fullName || `User ID: ${userId}`;

    // 🛑 1. Custom Confirmation Toast (Instead of window.confirm)
    toast((t) => (
        <div style={{ padding: '5px' }}>
            <p style={{ marginBottom: '10px' }}>
                Are you sure you want to delete user: <strong>{nameToConfirm}</strong>?
            </p>
            <button 
                onClick={async () => {
                    toast.dismiss(t.id); // Dismiss the confirmation toast
                    
                    try {
                        // Perform the delete action
                        await axios.delete(`http://localhost:5001/api/admin/users/${userId}`, {
                            headers: { Authorization: `Bearer ${token}` },
                            withCredentials: true 
                        });
                        
                        // 🛑 Success Toast
                        setUsers(users.filter(user => user._id !== userId));
                        toast.success(`User ${nameToConfirm} deleted.`, {
                            icon: <CheckCircle color="#00bcd4" />,
                        });
                        
                    } catch (err) {
                        const errMsg = err.response?.data?.message || 'Failed to delete user.';
                        // 🛑 Error Toast
                        toast.error(errMsg, {
                            icon: <XCircle color="#ff7f50" />,
                        });
                        setError(errMsg); // Still keep state error for visibility
                    }
                }}
                className="action-button delete-button"
                style={{ marginRight: '10px' }}
            >
                <Trash size={16} style={{ marginRight: '5px' }}/> Confirm Delete
            </button>
            <button onClick={() => toast.dismiss(t.id)} className="action-button details-button">
                Cancel
            </button>
        </div>
    ), {
        duration: Infinity, // Keep open until user interacts
    });
};

    if (loading) return (
        // 🛑 Loader UI as defined above 🛑
        <div className="dashboard-container" style={{ textAlign: 'center', padding: '100px' }}>
            <Loader2 className="spinner" size={48} color="#00bcd4" />
            <p style={{ marginTop: '20px', fontSize: '1.2rem' }}>Loading User Data...</p>
        </div>
    );

    return (
    <div className="dashboard-container">
        {/* 🛑 TOASTER COMPONENT */}
        <Toaster 
            position="top-right"
            toastOptions={{
                style: {
                    background: '#2c2c45', // Dark Card Background
                    color: '#e0e0f0',      // Soft White Text
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                    border: '1px solid #4a4a6b',
                },
            }}
        />
        {/* 🛑 HEADER WITH LOGOUT BUTTON 🛑 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '15px', marginBottom: '30px' }}>
            <h2>📊 User Management Dashboard</h2>
            <button
                onClick={logout} 
                className="action-button delete-button"
                style={{ backgroundColor: '#FF8C00' }} // Dark Orange for Logout
            >
                Logout
            </button>
        </div>
        
        <table className="user-table">
            <thead>
                <tr>
                    <th>Full Name</th><th>Email</th><th>Role</th><th>Created At</th><th>Status</th><th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                    <tr key={user._id}>
                        <td>{user.fullName || user.username}</td>
                        <td>{user.email}</td>
                        <td><strong>{user.role.toUpperCase()}</strong></td>
                        <td className="date-cell">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td style={{ color: user.isBanned ? 'var(--delete-color)' : 'var(--accent-color-primary)' }}>{user.isBanned ? 'BANNED' : 'Active'}</td>
                        <td>
                            <button 
                                onClick={() => showDetails(user)} 
                                className="action-button details-button"
                            >
                                Details
                            </button>{' '}
                            <button 
                                onClick={() => handleDelete(user._id, user.fullName || user.username)}
                                disabled={user.role === 'admin'} 
                                className="action-button delete-button"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

        {selectedUser && (
            <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} />
        )}
    </div>
    );
};

export default UserManagement;