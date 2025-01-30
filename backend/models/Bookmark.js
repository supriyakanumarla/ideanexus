const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  itemType: {
    type: String,
    enum: ['projects', 'users'],
    required: true
  }
}, {
  timestamps: true
});

// Compound index for efficient lookups
bookmarkSchema.index({ userId: 1, itemId: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema); 