import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { compressImage } from '/home/rguktongole/Desktop/ideanexus/frontend/src/utils/imageCompression';
import '/home/rguktongole/Desktop/ideanexus/frontend/src/components/userprofile/userprofile.css';
import DefaultProfilePicture from '/home/rguktongole/Desktop/ideanexus/frontend/src/assets/profile-placeholder.jpg';

// Base API URL from .env file
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const UserProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    bio: '',
    profilePicture: DefaultProfilePicture,
  });
  const [message, setMessage] = useState('');

  // Fetch profile data on component load
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/user/profile`)
      .then((response) => {
        const { username, email, bio, profilePicture } = response.data;
        setProfileData({
          username,
          email,
          bio,
          profilePicture: profilePicture || DefaultProfilePicture,
        });
      })
      .catch((error) => {
        console.error('Error fetching profile:', error);
        setMessage('Error fetching profile data.');
      });
  }, []);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleSave = () => {
    axios
      .put(`${API_BASE_URL}/user/profile`, profileData)
      .then((response) => {
        setProfileData({
          ...response.data.user,
          profilePicture: response.data.user.profilePicture || DefaultProfilePicture,
        });
        setMessage('Profile updated successfully!');
        setIsEditing(false);
      })
      .catch((error) => {
        console.error('Error updating profile:', error.response || error);
        setMessage('Error updating profile. Please try again.');
      });
  };

  const handleProfilePictureChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      try {
        const compressedFile = await compressImage(file);

        // Convert compressed file to Base64
        const reader = new FileReader();
        reader.onload = () => {
          setProfileData((prev) => ({
            ...prev,
            profilePicture: reader.result, // Base64 encoded string
          }));
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Error handling profile picture:', error);
        setMessage('Error uploading profile picture. Please try again.');
      }
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-pic-container">
          <img src={profileData.profilePicture} alt="Profile" className="profile-pic" />
          {isEditing && (
            <div className="change-photo-section">
              <label className="custom-file-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  style={{ display: 'none' }}
                />
                Change Photo
              </label>
            </div>
          )}
        </div>

        {!isEditing ? (
          <>
            <h2>{profileData.username}</h2>
            <button className="edit-btn" onClick={handleEditToggle}>
              Edit Profile
            </button>
          </>
        ) : null}
      </div>

      <div className="profile-details">
        {isEditing ? (
          <form className="profile-form">
            <label>Username:</label>
            <input
              type="text"
              value={profileData.username}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, username: e.target.value }))
              }
            />

            <label>Email:</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, email: e.target.value }))
              }
            />

            <label>Bio:</label>
            <textarea
              value={profileData.bio}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, bio: e.target.value }))
              }
            ></textarea>

            <button type="button" onClick={handleSave} className="save-btn">
              Save Changes
            </button>
          </form>
        ) : (
          <div className="details-view">
            <p>
              <strong>Email:</strong> {profileData.email}
            </p>
            <p>
              <strong>Bio:</strong> {profileData.bio}
            </p>
          </div>
        )}
      </div>

      {message && (
        <p className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default UserProfilePage;
