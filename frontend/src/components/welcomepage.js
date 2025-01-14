import React from 'react';
import { Link } from 'react-router-dom';
import '/home/rguktongole/Desktop/ideanexus/frontend/src/styles/welcomepage.css';
import backgroundImage from '/home/rguktongole/Desktop/ideanexus/frontend/src/assets/background.jpeg';

function WelcomePage() {
  return (
    <div className="welcome-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="overlay">
        <div className="welcome-content">
          <h1 className="welcome-message">Welcome to IdeaNexus!</h1>
          <p className="tagline">Connect. Create. Collaborate.</p>
          <div className="buttons-container">
            <Link to="/login">
              <button className="action-button large-button">Login</button>
            </Link>
            <Link to="/signup">
              <button className="action-button large-button">Signup</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
