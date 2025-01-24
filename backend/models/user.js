const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  username: { 
    type: String, 
    required: true, 
    unique: true 
  }, // Username field
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  userType: { 
    type: String, 
    required: true, 
    enum: ['student', 'professional'] 
  }, // User type
  bio: { 
    type: String, 
    default: '' 
  }, // Bio field for user description
  createdAt: { 
    type: Date, 
    default: Date.now 
  }, // Account creation date
  updatedAt: { 
    type: Date, 
    default: Date.now 
  } // Profile update date
});

// Pre-save middleware to update the `updatedAt` field on save
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Pre-update middleware to update the `updatedAt` field on update
userSchema.pre('findOneAndUpdate', function (next) {
  this._update.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);
