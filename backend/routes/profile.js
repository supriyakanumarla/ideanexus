const express = require('express');
const router = express.Router();
const auth = require('/home/rguktongole/Desktop/ideanexus/backend/middlewear/authmiddleware.js');
const User = require('/home/rguktongole/Desktop/ideanexus/backend/app/models/user.js');
const multer = require('multer');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs-extra');
const validator = require('validator');

// Validation middleware
const validateProfileData = (req, res, next) => {
  const errors = [];
  const { username, email, bio } = req.body;

  // Username validation
  if (username && !validator.isLength(username, { min: 3, max: 30 })) {
    errors.push('Username must be between 3 and 30 characters');
  }

  // Email validation
  if (email && !validator.isEmail(email)) {
    errors.push('Invalid email address');
  }

  // Bio validation
  if (bio && !validator.isLength(bio, { max: 500 })) {
    errors.push('Bio must not exceed 500 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
fs.ensureDirSync(uploadsDir);

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Image processing function
async function processImage(buffer) {
  try {
    const filename = `${uuidv4()}.webp`;
    const filepath = path.join(uploadsDir, filename);

    await sharp(buffer)
      .resize(400, 400, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 80 })
      .toFile(filepath);

    return `/uploads/${filename}`;
  } catch (error) {
    console.error('Image processing error:', error);
    throw new Error('Failed to process image');
  }
}

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    res.json({
      success: true,
      user: {
        ...user.toObject(),
        profilePicture: user.profilePicture ? 
          `http://localhost:5002${user.profilePicture}` : null
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching profile' 
    });
  }
});

// Update user profile
router.put('/profile', auth, upload.single('profilePicture'), validateProfileData, async (req, res) => {
  try {
    const { username, email, bio } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check for duplicate email
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    // Update basic fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (bio !== undefined) user.bio = bio;

    // Handle profile picture
    if (req.file) {
      try {
        // Delete old profile picture if it exists
        if (user.profilePicture) {
          const oldPath = path.join(__dirname, '..', user.profilePicture);
          await fs.remove(oldPath).catch(() => {});
        }

        // Process and save new image
        const imagePath = await processImage(req.file.buffer);
        user.profilePicture = imagePath;
      } catch (error) {
        console.error('Error processing profile picture:', error);
        return res.status(400).json({
          success: false,
          message: 'Error processing profile picture'
        });
      }
    }

    await user.save();
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture ? 
          `http://localhost:5002${user.profilePicture}` : null
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating profile',
      error: error.message 
    });
  }
});

// Serve static files
router.use('/uploads', express.static(uploadsDir));

module.exports = router;
