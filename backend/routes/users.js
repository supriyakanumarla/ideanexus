const express = require('express');
const router = express.Router();
const User = require('/home/rguktongole/Desktop/ideanexus/backend/models/user.js');
const auth = require('/home/rguktongole/Desktop/ideanexus/backend/middlewear/authmiddleware.js');
const { body, validationResult } = require('express-validator');

router.put('/profile',
  auth,
  [
    body('username')
      .optional()
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters'),
    body('email')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('bio')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Bio cannot exceed 500 characters')
  ],
  async (req, res) => {
    try {
      // Validation check
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          status: 'error',
          errors: errors.array() 
        });
      }

      const updateFields = {};
      const allowedFields = ['username', 'email', 'bio'];
      
      // Only include fields that were actually sent
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updateFields[field] = req.body[field];
        }
      });

      // Check if email is being updated and verify it's not already in use
      if (updateFields.email) {
        const existingUser = await User.findOne({ 
          email: updateFields.email,
          _id: { $ne: req.user.id }
        });
        
        if (existingUser) {
          return res.status(400).json({
            status: 'error',
            message: 'Email already in use'
          });
        }
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { $set: updateFields },
        { new: true, runValidators: true }
      ).select('-password');

      if (!updatedUser) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      res.json({
        status: 'success',
        data: updatedUser
      });

    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Server error while updating profile',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
); 