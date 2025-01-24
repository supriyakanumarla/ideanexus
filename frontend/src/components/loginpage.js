import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '/home/rguktongole/Desktop/ideanexus/frontend/src/styles/loginpage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5002/api/auth/login', { email, password });
      console.log('Login successful:', response.data);
      localStorage.setItem('token', response.data.token);

      setSuccessMessage('Login successful!');
      setError('');
      navigate('/dashboard');  // Redirect to dashboard
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password. Please try again.');
      setSuccessMessage('');
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
          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
        </form>
        <p className="signup-prompt">
          Don't have an account? <a href="/signup">Sign up here</a>.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
