const express = require('express');
const authenticateUser = require('/home/rguktongole/Desktop/ideanexus/backend/middlewear/authmiddleware.js');
const User = require('/home/rguktongole/Desktop/ideanexus/backend/app/models/user.js');

const router = express.Router();

// Update Profile Route
router.put('/updateProfile', authenticateUser, async (req, res) => {
  const { name, email, bio } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.userId, // Use userId from middleware
      { name, email, bio },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'Profile updated successfully.', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
