import React, { useState } from 'react';
import '/home/rguktongole/Desktop/ideanexus/frontend/src/components/userprofile/userprofile.css';
import DefaultProfilePicture from '/home/rguktongole/Desktop/ideanexus/frontend/src/assets/profile-placeholder.jpg'; // Import the default image

const UserProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState(DefaultProfilePicture); // Use imported image as default
  const [username, setUsername] = useState('JohnDoe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [bio, setBio] = useState('This is my bio');

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('Profile saved:', { username, email, bio });
  };

  const handleProfilePictureChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      const imageURL = URL.createObjectURL(file);
      setProfilePicture(imageURL);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        {/* Profile Picture Section */}
        <div className="profile-pic-container">
          <img src={profilePicture} alt="Profile" className="profile-pic" />
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

        {!isEditing && <h2>{username}</h2>}
        {!isEditing && (
          <button className="edit-btn" onClick={handleEditToggle}>
            Edit Profile
          </button>
        )}
      </div>

      <div className="profile-details">
        {isEditing ? (
          <form className="profile-form">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Bio:</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            ></textarea>

            <button type="button" onClick={handleSave} className="save-btn">
              Save Changes
            </button>
          </form>
        ) : (
          <div className="details-view">
            <p>
              <strong>Email:</strong> {email}
            </p>
            <p>
              <strong>Bio:</strong> {bio}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
