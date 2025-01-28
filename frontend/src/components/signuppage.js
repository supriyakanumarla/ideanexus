import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import '/home/rguktongole/Desktop/ideanexus/frontend/src/styles/signuppage.css';
import backgroundImage from '/home/rguktongole/Desktop/ideanexus/frontend/src/assets/background.jpeg';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        userType: ''
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        setError('');
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('Name is required');
            return false;
        }
        if (!formData.username.trim()) {
            setError('Username is required');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Email is required');
            return false;
        }
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (!formData.password) {
            setError('Password is required');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        if (!formData.userType) {
            setError('Please select a user type');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!validateForm()) {
            return;
        }

        try {
            setSuccessMessage('Processing...');

            const response = await axiosInstance.post('/auth/signup', formData);

            if (response.data.success) {
                setSuccessMessage('Registration successful! Redirecting to dashboard...');
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            }
        } catch (error) {
            console.error('Signup error:', error);
            setSuccessMessage('');
            
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else if (error.message === 'Network Error') {
                setError('Server connection failed. Please check if the server is running.');
            } else {
                setError('Registration failed. Please try again.');
            }
        }
    };

    return (
        <div className="signup-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="signup-box">
                <h2>Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <select
                            name="userType"
                            value={formData.userType}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select User Type</option>
                            <option value="student">Student</option>
                            <option value="professional">Professional</option>
                        </select>
                    </div>
                    <button 
                        type="submit" 
                        className="signup-button"
                        disabled={!formData.name || !formData.username || !formData.email || !formData.password || !formData.userType}
                    >
                        Sign Up
                    </button>
                </form>
                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
                <p className="login-link">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
