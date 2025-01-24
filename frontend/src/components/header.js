import React from 'react';
import { useNavigate } from 'react-router-dom';
import '/home/rguktongole/Desktop/ideanexus/frontend/src/styles/header.css';
import profilePlaceholder from '/home/rguktongole/Desktop/ideanexus/frontend/src/assets/profile-placeholder.jpg';

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token'); // Check for login token

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="header-container">
      <div className="header-left" onClick={handleProfileClick}>
        <img src={profilePlaceholder} alt="Profile" className="profile-icon" />
      </div>
      <div className="header-center">
        <input type="text" className="search-bar" placeholder="Search" />
      </div>
      <div className="header-right">
        <span onClick={() => navigate('/messages')} className="messages-icon">
          Messages
        </span>
      </div>
    </header>
  );
};

export default Header;
