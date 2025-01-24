import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api'; // API URL

// Function to fetch the user profile
export const fetchUserProfile = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data; // Return user data
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error.response?.data || 'Failed to fetch user profile.';
    }
};

// Function to update user profile
export const updateUserProfile = async (token, userData) => {
    try {
        const response = await axios.put(`${API_URL}/auth/profile`, userData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data; // Return success message or updated data
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error.response?.data || 'Error updating profile.';
    }
};
