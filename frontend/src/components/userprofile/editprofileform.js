// src/components/UserProfile/EditProfileForm.js
import React, { useState } from 'react';
import '/home/rguktongole/Desktop/ideanexus/frontend/src/components/userprofile/userprofile.css';

const EditProfileForm = ({ user, setEditMode }) => {
    const [username, setUsername] = useState(user.username || '');
    const [email, setEmail] = useState(user.email || '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email }),
        });
        if (response.ok) {
            setEditMode(false);
        }
    };

    return (
        <form className="edit-profile-form" onSubmit={handleSubmit}>
            <label>Username:</label>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <label>Email:</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditMode(false)}>
                Cancel
            </button>
        </form>
    );
};

export default EditProfileForm;
