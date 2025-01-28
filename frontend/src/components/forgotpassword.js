import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '/home/rguktongole/Desktop/ideanexus/frontend/src/styles/forgotpassword.css';
import backgroundImage from '/home/rguktongole/Desktop/ideanexus/frontend/src/assets/background.jpeg';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/forgot-password`, { email });
      setMessage('If an account exists with this email, you will receive a reset code.');
      setStep(2);
    } catch (err) {
      setError('Error processing request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/verify-reset-code`, {
        email,
        code: resetCode
      });
      setMessage('Code verified successfully');
      setStep(3);
    } catch (err) {
      setError('Invalid or expired code');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/reset-password`, {
        email,
        code: resetCode,
        newPassword
      });
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Error resetting password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="forgot-password-box">
        <h2>Reset Password</h2>
        
        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <p>Enter your email address to receive a reset code.</p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <button type="submit" className="reset-btn" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleCodeSubmit}>
            <p>Enter the reset code sent to your email.</p>
            <input
              type="text"
              placeholder="Reset Code"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              required
              disabled={isLoading}
            />
            <button type="submit" className="reset-btn" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordReset}>
            <p>Enter your new password.</p>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
            />
            <button type="submit" className="reset-btn" disabled={isLoading}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
        
        <p className="back-to-login">
          Remember your password? <a href="/login">Back to Login</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;