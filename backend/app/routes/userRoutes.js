const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Adjust path if needed

// Profile update route
router.post("/api/user/update", async (req, res) => {
  const { userId, username, email, bio } = req.body;

  if (!userId) {
    console.error("User ID is missing in the request body");
    return res.status(400).json({ message: "User ID is missing" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, bio },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", updatedUser });
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
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;

