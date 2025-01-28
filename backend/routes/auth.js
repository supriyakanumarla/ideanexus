const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('/home/rguktongole/Desktop/ideanexus/backend/models/user.js');
const { sendResetEmail } = require('/home/rguktongole/Desktop/ideanexus/backend/services/emailService.js');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Create token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Send success response
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                userType: user.userType
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'An error occurred during login'
        });
    }
});

// Signup route
router.post('/signup', async (req, res) => {
    try {
        const { name, username, email, password, userType } = req.body;

        // Validate input
        if (!name || !username || !email || !password || !userType) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email or username already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword,
            userType
        });

        // Save user to database
        await newUser.save();

        // Create JWT token
        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Send success response
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
                userType: newUser.userType
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'An error occurred during registration'
        });
    }
});

// Forgot Password route
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            // Send success response even if user doesn't exist (security)
            return res.json({
                success: true,
                message: 'If an account exists, a reset code will be sent.'
            });
        }

        // Generate reset token
        const resetToken = Math.random().toString(36).substring(2, 8).toUpperCase();
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour

        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        await sendResetEmail(email, resetToken);

        res.json({
            success: true,
            message: 'If an account exists, a reset code will be sent.'
        });
    } catch (error) {
        console.error('Password reset request error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing request'
        });
    }
});

// Verify Reset Code route
router.post('/verify-reset-code', async (req, res) => {
    try {
        const { email, code } = req.body;
        const user = await User.findOne({
            email,
            resetToken: code,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset code'
            });
        }

        res.json({
            success: true,
            message: 'Code verified successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error verifying code'
        });
    }
});

// Reset Password route
router.post('/reset-password', async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        const user = await User.findOne({
            email,
            resetToken: code,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset code'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.json({
            success: true,
            message: 'Password reset successful'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error resetting password'
        });
    }
});

// Get user profile route
router.get('/profile', async (req, res) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Find user
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Send user data
        res.json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio || '',
                profilePicture: user.profilePicture || null,
                userType: user.userType
            }
        });

    } catch (error) {
        console.error('Profile fetch error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error fetching profile data'
        });
    }
});

// Update profile route - handles both profile data and picture
router.put('/profile', upload.single('profilePicture'), async (req, res) => {
    try {
        console.log('Profile update request received');
        console.log('Files:', req.file);
        console.log('Body:', req.body);

        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update basic profile fields
        const { username, email, bio } = req.body;
        
        if (username) user.username = username;
        if (email) user.email = email;
        if (bio !== undefined) user.bio = bio;

        // Handle profile picture if uploaded
        if (req.file) {
            console.log('New profile picture uploaded:', req.file.filename);
            const profilePicturePath = `http://localhost:5002/uploads/${req.file.filename}`;
            console.log('Profile picture path:', profilePicturePath);
            user.profilePicture = profilePicturePath;
        }

        await user.save();
        console.log('User saved successfully:', user);

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                profilePicture: user.profilePicture,
                userType: user.userType
            }
        });

    } catch (error) {
        console.error('Profile update error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Error updating profile'
        });
    }
});

module.exports = router;