
import React from 'react';

import './UserDetailsModel.css'; 

const UserDetailsModal = ({ user, onClose }) => {
    if (!user) return null;

    const formatTime = (dateString) => new Date(dateString).toLocaleString();

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <button onClick={onClose} className="close-button">X</button>
                <h2>User Details: {user.fullName || user.username}</h2>
                <hr />
                
                <p><strong>Full Name:</strong> {user.fullName}</p>
                {/* <p><strong>Username:</strong> {user.username}</p> */}
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> <span style={{ fontWeight: 'bold' }}>{user.role.toUpperCase()}</span></p>
                <p><strong>Status:</strong> {user.isBanned ? 'BANNED' : 'Active'}</p>
                <p><strong>User ID:</strong> {user._id}</p>
                <p><strong>Created At:</strong> {formatTime(user.createdAt)}</p>
                <p><strong>Last Updated:</strong> {formatTime(user.updatedAt)}</p>
                
                {user.profilePicture && 
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <img 
                            src={user.profilePicture} 
                            alt="Profile" 
                            style={{ width: '100px', height: '100px', borderRadius: '50%', border: '2px solid var(--accent-color-primary)' }} 
                        />
                    </div>
                }
            </div>
        </div>
    );
};

export default UserDetailsModal;