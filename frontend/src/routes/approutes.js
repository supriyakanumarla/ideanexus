// src/routes/AppRoutes.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '/home/rguktongole/Desktop/ideanexus/frontend/src/components/dashboard/userdashboard.js';
import UserProfile from '/home/rguktongole/Desktop/ideanexus/frontend/src/components/userprofile/userprofile.js';
import Chats from '/home/rguktongole/Desktop/ideanexus/frontend/src/components/chats/chats.js';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard messageCount={5} />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/chats" element={<Chats />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
