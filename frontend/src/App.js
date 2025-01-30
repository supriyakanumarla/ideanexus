import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Importing components
import WelcomePage from '/home/rguktongole/Desktop/ideanexus/frontend/src/components/welcomepage.js';
import LoginPage from '/home/rguktongole/Desktop/ideanexus/frontend/src/components/loginpage.js';
import SignUpPage from '/home/rguktongole/Desktop/ideanexus/frontend/src/components/signuppage.js';
import ProfilePage from '/home/rguktongole/Desktop/ideanexus/frontend/src/components/profilepage.js';
import Dashboard from '/home/rguktongole/Desktop/ideanexus/frontend/src/components/dashboard/userdashboard.js';
import UserProfilePage from '/home/rguktongole/Desktop/ideanexus/frontend/src/components/userprofile/userprofile.js';
import ForgotPassword from '/home/rguktongole/Desktop/ideanexus/frontend/src/components/forgotpassword.js';

const App = () => {
  return (
    <>
      <Toaster position="top-right" />
      <div className="app">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user-profile" element={<UserProfilePage />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
