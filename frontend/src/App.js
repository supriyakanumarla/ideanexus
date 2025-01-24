import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

// Importing components
import WelcomePage from '/home/rguktongole/Desktop/ideanexus/frontend/src/components/welcomepage.js';
import LoginPage from '/home/rguktongole/Desktop/ideanexus/frontend/src/components/loginpage.js';
import SignUpPage from '/home/rguktongole/Desktop/ideanexus/frontend/src/components/signuppage.js';
import ProfilePage from '/home/rguktongole/Desktop/ideanexus/frontend/src/components/profilepage.js';
import Dashboard from '/home/rguktongole/Desktop/ideanexus/frontend/src/components/dashboard/userdashboard.js';
import UserProfilePage from '/home/rguktongole/Desktop/ideanexus/frontend/src/components/userprofile/userprofile.js';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user-profile" element={<UserProfilePage />} />
      </Routes>
    </Router>
  );
};

export default App;
