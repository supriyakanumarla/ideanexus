const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('/home/rguktongole/Desktop/ideanexus/backend/routes/auth.js'); // Adjust path if necessary

// Load environment variables
dotenv.config();

// Log the JWT_SECRET to confirm it's loaded correctly
console.log('JWT_SECRET:', process.env.JWT_SECRET);

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse incoming JSON requests

// Use the auth routes
app.use('/api/auth', authRoutes);

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yourdbname'; // Fallback URI for development
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the app if MongoDB connection fails
  });

// Start the server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
