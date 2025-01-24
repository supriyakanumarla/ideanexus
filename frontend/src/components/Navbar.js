import React from 'react';
import { FaSearch, FaUser, FaEnvelope } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom'; 
import '/home/rguktongole/Desktop/ideanexus/frontend/src/styles/navbar.css'; // Ensure this file is styled correctly

const Navbar = () => {
    const navigate = useNavigate();

    // Redirect to user profile page
    const handleProfileClick = () => {
        navigate('/user-profile'); // Redirect to User Profile Page
    };

    // Redirect to the messages page
    const handleMessagesClick = () => {
        navigate('/chats'); // Redirect to Chats Page
    };

    // Redirect to the dashboard (if user is logged in and clicks home)
    const handleDashboardClick = () => {
        navigate('/dashboard'); // Redirect to User Dashboard
    };

    return (
        <div className="navbar-container">
            <header className="navbar-header">
                <div className="logo" onClick={handleDashboardClick} title="Dashboard">
                    <h1>IdeaNexus</h1> {/* Logo can be text or image */}
                </div>
                
                <div className="search-container">
                    <input
                        type="text"
                        className="search-bar"
                        placeholder="Search..."
                        aria-label="Search"
                    />
                    <FaSearch className="search-icon" />
                </div>

                <div className="navbar-icons">
                    <div
                        className="profile-logo"
                        title="Profile"
                        onClick={handleProfileClick} // Clicking the profile icon leads to user profile page
                    >
                        <FaUser />
                    </div>

                    <div
                        className="message-icon"
                        title="Messages"
                        onClick={handleMessagesClick} // Clicking the message icon leads to messages page
                    >
                        <FaEnvelope />
                        <span className="message-badge">3</span> {/* Example message badge */}
                    </div>
                </div>
            </header>
        </div>
    );
};

export default Navbar;
