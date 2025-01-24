import React from 'react';
import { Link } from 'react-router-dom';
import '/home/rguktongole/Desktop/ideanexus/frontend/src/components/dashboard/UserDashboard.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSearch, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const UserDashboardPage = () => {
  return (
    <div className="user-dashboard-page">
      <header className="header">
        {/* Profile Icon */}
        <Link to="/user-profile" className="profile-icon">
          <FontAwesomeIcon icon={faUser} className="icon" />
        </Link>

        {/* Search Bar */}
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </div>

        {/* Message Icon */}
        <div className="message-icon">
          <FontAwesomeIcon icon={faEnvelope} className="icon" />
          <span className="message-badge">3</span> {/* Badge for new messages */}
        </div>
      </header>

      {/* Content */}
      <div className="content">
        <h2>Welcome to the Dashboard</h2>
        <p>Explore, connect, and create!</p>
      </div>
    </div>
  );
};

export default UserDashboardPage;
