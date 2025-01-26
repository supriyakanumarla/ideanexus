const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
    enum: ['student', 'professional'],
  },
  bio: {
    type: String,
    default: '',
  },
  profilePicture: {
    type: String, // Store the file path or URL
    default: '', // Default will be handled in the frontend
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update `updatedAt` automatically on save
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Update `updatedAt` automatically on update
userSchema.pre('findOneAndUpdate', function (next) {
  this._update.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);
