import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from '/home/rguktongole/Desktop/ideanexus/frontend/src/components/welcomepage.js';
import LoginPage from '/home/rguktongole/Desktop/ideanexus/frontend/src/components/loginpage.js';
import SignUpPage from '/home/rguktongole/Desktop/ideanexus/frontend/src/components/signuppage.js';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </Router>
  );
};

export default App;
