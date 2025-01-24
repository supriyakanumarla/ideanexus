import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '/home/rguktongole/Desktop/ideanexus/frontend/src/styles/signuppage.css';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5002/api/auth/signup', { name, username, email, password, userType });
      console.log('Sign Up successful:', response.data);
      setSuccessMessage('User registered successfully!');
      setName('');
      setUsername('');
      setEmail('');
      setPassword('');
      setUserType('');
      navigate('/dashboard');  // Redirect to dashboard after signup
    } catch (err) {
      console.error('Sign Up error:', err);
      setError('Error registering user. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <select value={userType} onChange={(e) => setUserType(e.target.value)} required>
              <option value="">Select User Type</option>
              <option value="student">Student</option>
              <option value="professional">Professional</option>
            </select>
          </div>
          <button type="submit" className="btn-signin">Sign Up</button>
          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
