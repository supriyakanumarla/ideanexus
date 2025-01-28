const mongoose = require('mongoose');

// Clear existing model
if (mongoose.models.User) {
    delete mongoose.models.User;
    delete mongoose.modelSchemas.User;
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
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
        maxlength: 500,
        default: ''
    },
    profilePicture: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('User', userSchema);
