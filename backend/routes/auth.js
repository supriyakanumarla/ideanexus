const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('/home/rguktongole/Desktop/ideanexus/backend/models/user.js'); // Adjust the path if necessary
const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { name, username, email, password, userType } = req.body;

    // Validate input fields
    if (!name || !username || !email || !password || !userType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists with this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      userType,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup error:', error); // Log the full error
    res.status(500).json({
      message: 'An error occurred during signup',
      error: error.message,
      stack: error.stack,
    });
  }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input fields
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Debugging: Check if JWT_SECRET is available
        console.log('JWT_SECRET in login route:', process.env.JWT_SECRET);

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return success response with token
        res.status(200).json({
            message: 'Login successful',
            token: token,  // Send the token as part of the response
        });
    } catch (error) {
        console.error('Login error:', error); // Log full error
        res.status(500).json({
            message: 'An error occurred during login',
            error: error.message,
            stack: error.stack,
        });
    }
});


module.exports = router;
