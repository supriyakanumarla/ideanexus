const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Clear existing model
if (mongoose.models.User) {
    delete mongoose.models.User;
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true,
        enum: ['student', 'professional']
    },
    resetToken: String,
    resetTokenExpiry: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastPasswordReset: Date,
    bio: {
        type: String,
        default: ''
    },
    profilePicture: {
        type: String,
        default: null
    },
    skills: [{
        type: String,
        trim: true
    }]
});

// Add password hashing middleware
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('User', userSchema);
