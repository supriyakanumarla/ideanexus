const express = require('express');
const router = express.Router();
const User = require('/home/rguktongole/Desktop/ideanexus/backend/app/models/user.js'); // Adjust path if necessary

// Fetch user profile
router.get('/profile', async (req, res) => {
  try {
    let user = await User.findOne();
    if (!user) {
      user = new User(); // Create a default user if not found
      await user.save();
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user profile.' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  const { username, email, bio, profilePicture } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      {}, // Update the first user (default behavior)
      { username, email, bio, profilePicture },
      { new: true, upsert: true } // Create if not exists
    );
    res.json({ message: 'Profile updated successfully!', user });
  } catch (err) {
    res.status(500).json({ error: 'Error updating user profile.' });
  }
});

module.exports = router;
