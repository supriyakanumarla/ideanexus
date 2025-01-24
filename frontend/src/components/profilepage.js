import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUserDetails = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID is missing from localStorage.");
      }
      console.log("Fetching details for User ID:", userId);

      const response = await axios.get(`http://localhost:5002/api/profile/${userId}`);
      setUserDetails(response.data);
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError(err.response?.data?.error || 'API route not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {userDetails.name}</p>
      <p>Email: {userDetails.email}</p>
      <p>Bio: {userDetails.bio}</p>
    </div>
  );
};

export default ProfilePage;
