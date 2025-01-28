import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import '/home/rguktongole/Desktop/ideanexus/frontend/src/index.css';
import App from '/home/rguktongole/Desktop/ideanexus/frontend/src/App.js';

// Set default axios base URL
axios.defaults.baseURL = 'http://localhost:5002/api';

// Add axios interceptor for auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Create a root and render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

