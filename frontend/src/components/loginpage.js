import React, { useState } from 'react';
import axios from 'axios';
import '/home/rguktongole/Desktop/ideanexus/frontend/src/styles/loginpage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5002/api/auth/login', { email, password });
      console.log('Login successful:', response.data);
      localStorage.setItem('token', response.data.token);
      setSuccessMessage('Login successful!');
      setError(''); // Reset error message on successful login
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid credentials');
      setSuccessMessage(''); // Reset success message on error
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn-login">Login</button>
          {error && <p className="error-message fade-in">{error}</p>}
          {successMessage && <p className="success-message fade-in">{successMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
