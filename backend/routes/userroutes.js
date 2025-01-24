const express = require("express");
const router = express.Router();
const User = require("/home/rguktongole/Desktop/ideanexus/backend/app/models/user.js"); // Adjust path if needed

// Middleware to validate required fields for profile updates
const validateUpdateRequest = (req, res, next) => {
  const { userId, username, email } = req.body;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  if (!username || !email) {
    return res.status(400).json({ message: "Username and email are required" });
  }
  next();
};

// Profile update route
router.post("/api/user/update", validateUpdateRequest, async (req, res) => {
  const { userId, username, email, bio } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, bio },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get user details route
router.get("/api/user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching user details:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
