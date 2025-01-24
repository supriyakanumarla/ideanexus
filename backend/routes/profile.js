const express = require('express');
const User = require('/home/rguktongole/Desktop/ideanexus/backend/models/user.js'); // Correct relative path to the User model
const router = express.Router();

// Update Profile Route
router.put('/update', async (req, res) => {
  const { userId, name, email, profilePicture, bio } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (profilePicture) user.profilePicture = profilePicture;
    if (bio) user.bio = bio;

    await user.save();

    res.status(200).json({ message: 'Profile updated successfully.', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Failed to update profile.', error });
  }
});

module.exports = router;
