import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { compressImage } from '../../utils/imageCompression';
import '/home/rguktongole/Desktop/ideanexus/frontend/src/components/userprofile/userprofile.css';
import DefaultProfilePicture from '/home/rguktongole/Desktop/ideanexus/frontend/src/assets/profile-placeholder.jpg';

const UserProfilePage = () => {
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    bio: '',
    profilePicture: DefaultProfilePicture,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [imageKey, setImageKey] = useState(Date.now());

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await axios.get('http://localhost:5002/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.success) {
        const userData = response.data.user;
        console.log('Fetched profile data:', userData);
        
        setProfileData({
          username: userData.username || '',
          email: userData.email || '',
          bio: userData.bio || '',
          profilePicture: userData.profilePicture || DefaultProfilePicture,
        });
        setImageKey(Date.now());
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      if (error.response?.status === 401) {
        window.location.href = '/login';
      } else {
        setMessage('Error loading profile data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log('Selected file:', file);
      
      try {
        const compressedImage = await compressImage(file);
        console.log('Compressed image:', compressedImage);
        
        setProfileData(prev => ({
          ...prev,
          profilePicture: compressedImage
        }));
        
        // Trigger update immediately when file is selected
        const formData = new FormData();
        formData.append('profilePicture', compressedImage);
        formData.append('username', profileData.username);
        formData.append('email', profileData.email);
        formData.append('bio', profileData.bio);

        const token = localStorage.getItem('token');
        const response = await axios.put(
          'http://localhost:5002/api/auth/profile',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        if (response.data && response.data.success) {
          console.log('Profile picture updated:', response.data);
          setMessage('Profile picture updated successfully!');
          // Force reload the image
          setImageKey(Date.now());
          // Fetch updated profile data
          await fetchProfileData();
        }
      } catch (error) {
        console.error('Error updating profile picture:', error);
        setMessage('Error updating profile picture. Please try again.');
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
            return;
        }

        const formData = new FormData();
        formData.append('username', profileData.username);
        formData.append('email', profileData.email);
        formData.append('bio', profileData.bio);

        // Only append profile picture if it's a new file
        if (profileData.profilePicture instanceof File) {
            formData.append('profilePicture', profileData.profilePicture);
        }

        const response = await axios.put(
            'http://localhost:5002/api/auth/profile',
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        if (response.data && response.data.success) {
            setMessage('Profile updated successfully!');
            setIsEditing(false);
            fetchProfileData(); // Refresh the profile data
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        setMessage(
            error.response?.data?.message || 
            'Error updating profile. Please try again.'
        );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-pic-container">
          <img 
            key={imageKey}
            src={`${profileData.profilePicture}?${imageKey}`}
            alt="Profile" 
            className="profile-pic"
            onError={(e) => {
              console.log('Image load error, using default');
              e.target.src = DefaultProfilePicture;
            }}
          />
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

        <h2 className="profile-name">{profileData.username}</h2>
      </div>

      <div className="profile-content">
        {isEditing ? (
          <form onSubmit={handleUpdate} className="profile-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={profileData.username}
                onChange={handleInputChange}
                required
                minLength={3}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                maxLength={500}
                rows="3"
                placeholder="Tell us about yourself..."
              />
              <small className="char-count">{profileData.bio.length}/500</small>
            </div>

            <div className="button-group">
              <button type="submit" className="save-btn">
                Save Changes
              </button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-group">
              <label>Email</label>
              <p>{profileData.email}</p>
            </div>
            
            <div className="info-group">
              <label>Bio</label>
              <p>{profileData.bio || 'No bio added yet.'}</p>
            </div>

            <button 
              onClick={() => setIsEditing(true)}
              className="edit-btn"
            >
              Edit Profile
            </button>
          </div>
        )}

        {message && (
          <div 
            className={`message ${message.includes('Error') ? 'error' : 'success'}`}
            onClick={() => setMessage('')}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
