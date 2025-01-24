import axios from 'axios';

// Fetch User Details
export const fetchUserDetails = async (userId) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication token is missing. Please log in again.');

  try {
    const response = await axios.get(`http://localhost:5002/api/profile/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error.response?.data || { message: 'An error occurred while fetching user details' };
  }
};

// Update User Details
export const updateUserDetails = async (userDetails) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication token is missing. Please log in again.');

  try {
    const response = await axios.put(
      'http://localhost:5002/api/profile/updateProfile',
      userDetails,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating user details:', error);
    throw error.response?.data || { message: 'An error occurred while updating user details' };
  }
};
