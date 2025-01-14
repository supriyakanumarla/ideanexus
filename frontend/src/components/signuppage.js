import React, { useState } from 'react';
import axios from 'axios';
import '/home/rguktongole/Desktop/ideanexus/frontend/src/styles/signuppage.css';

const SignInPage = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5002/api/auth/signup', {
        name,
        username,
        email,
        password,
        userType,
      });
      console.log('Sign Up successful:', response.data);
      setSuccessMessage('User registered successfully!');
      setError(''); // Reset error message on successful signup
    } catch (err) {
      console.error('Sign Up error:', err);
      setError('Error registering user');
      setSuccessMessage(''); // Reset success message on error
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
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
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            required
          >
            <option value="">Select User Type</option>
            <option value="student">Student</option>
            <option value="professional">Professional</option>
          </select>
          <button type="submit" className="btn-signin">Sign Up</button>
          {error && <p className="error-message fade-in">{error}</p>}
          {successMessage && <p className="success-message fade-in">{successMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
