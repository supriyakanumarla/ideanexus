import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaSearch, FaUserCircle } from 'react-icons/fa';
import './Header.css';

const Header = ({ user }) => {
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch unread messages
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const response = await fetch(`/api/messages/unread/${user?.id}`);
        const data = await response.json();
        setUnreadMessages(data.count);
      } catch (error) {
        console.error('Error fetching unread messages:', error);
      }
    };

    if (user?.id) {
      fetchUnreadMessages();
      // Poll for new messages every 30 seconds
      const interval = setInterval(fetchUnreadMessages, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.id]);

  return (
    <header className="dashboard-header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/dashboard" className="logo">
          IdeaNexus
        </Link>

        {/* Search Bar */}
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Right Section */}
        <div className="header-right">
          {/* Messages Icon */}
          <Link to="/messages" className="icon-wrapper">
            <FaEnvelope className="nav-icon" />
            {unreadMessages > 0 && (
              <span className="message-count">{unreadMessages}</span>
            )}
          </Link>

          {/* Profile Icon/Image */}
          <Link to="/profile" className="profile-wrapper">
            {user?.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt="Profile"
                className="profile-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<FaUserCircle className="nav-icon" />';
                }}
              />
            ) : (
              <FaUserCircle className="nav-icon" />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header; 