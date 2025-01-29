import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faSearch, 
  faEnvelope, 
  faPlus, 
  faLightbulb,
  faUsers 
} from '@fortawesome/free-solid-svg-icons';
import '/home/rguktongole/Desktop/ideanexus/frontend/src/components/dashboard/UserDashboard.css';

const UserDashboardPage = () => {
  const [profileData, setProfileData] = useState({
    profilePicture: null,
    username: ''
  });
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Fetch profile data and unread messages
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }

        // Fetch profile data
        const profileResponse = await axios.get('http://localhost:5002/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (profileResponse.data && profileResponse.data.success) {
          setProfileData({
            profilePicture: profileResponse.data.user.profilePicture,
            username: profileResponse.data.user.username
          });
        }

        // Fetch unread messages count
        const messagesResponse = await axios.get('http://localhost:5002/api/messages/unread', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (messagesResponse.data) {
          setUnreadMessages(messagesResponse.data.count);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    // Poll for new messages every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="user-dashboard-page">
      <header className="header">
        {/* Profile Icon/Image */}
        <Link to="/user-profile" className="profile-icon">
          {profileData.profilePicture ? (
            <img 
              src={profileData.profilePicture} 
              alt="Profile" 
              className="profile-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<FontAwesomeIcon icon={faUser} className="icon" />';
              }}
            />
          ) : (
            <FontAwesomeIcon icon={faUser} className="icon" />
          )}
        </Link>

        {/* Search Bar */}
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </div>

        {/* Message Icon */}
        <Link to="/messages" className="message-icon">
          <FontAwesomeIcon icon={faEnvelope} className="icon" />
          {unreadMessages > 0 && (
            <span className="message-badge">{unreadMessages}</span>
          )}
        </Link>
      </header>

      <div className="dashboard-content">
        {/* Quick Actions */}
        <div className="quick-actions">
          <Link to="/new-project" className="action-card create-project">
            <FontAwesomeIcon icon={faPlus} className="action-icon" />
            <span>Create New Project</span>
          </Link>
          <Link to="/browse-projects" className="action-card browse-projects">
            <FontAwesomeIcon icon={faLightbulb} className="action-icon" />
            <span>Browse Projects</span>
          </Link>
          <Link to="/find-collaborators" className="action-card find-collaborators">
            <FontAwesomeIcon icon={faUsers} className="action-icon" />
            <span>Find Collaborators</span>
          </Link>
        </div>

        {/* Welcome Message */}
        <div className="welcome-section">
          <h2>Welcome, {profileData.username}!</h2>
          <p>Start collaborating on exciting projects or create your own.</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
