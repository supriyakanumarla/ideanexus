const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const UserModel = require('/home/rguktongole/Desktop/ideanexus/backend/app/models/user.js'); // Import your user model
const app = express();

// Middleware
app.use(bodyParser.json()); // For parsing JSON in request bodies

// Database Connection
mongoose.connect('mongodb://localhost:27017/ideanexus', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false, // Prevents deprecation warnings
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1); // Exit the process if the database connection fails
    });

// Update Profile Route
app.put('/api/updateProfile', async (req, res) => {
    const { userId, name, email } = req.body;

    // Validate required fields
    if (!userId) {
        return res.status(400).json({ message: 'User ID is missing. Unable to update profile.' });
    }

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required for updating the profile.' });
    }

    try {
        // Update user details in the database
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { name, email },
            { new: true, runValidators: true } // Return the updated document and validate fields
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'Profile updated successfully.', user: updatedUser });
    } catch (error) {
        console.error('Error updating profile:', error);

        // Check if the error is a validation error
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation error.', details: error.errors });
        }

        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Fetch User Details Route
app.get('/api/user/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user details:', error);

        // Check if the error is related to invalid MongoDB ObjectId
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid user ID format.' });
        }

        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Root Route for Health Check
app.get('/', (req, res) => {
    res.status(200).json({ message: 'API is running.' });
});

// Start Server
const PORT = 3001; // Match your frontend configuration
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
