const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('/home/rguktongole/Desktop/ideanexus/backend/routes/auth.js');
const postRoutes = require('/home/rguktongole/Desktop/ideanexus/backend/routes/posts.js');
const profileRoutes = require('/home/rguktongole/Desktop/ideanexus/backend/routes/profile.js');

dotenv.config();

// Ensure JWT_SECRET is defined
if (!process.env.JWT_SECRET) {
  console.error('Error: JWT_SECRET is not defined in the .env file.');
  process.exit(1);
}

const app = express();

// Middleware to handle large payloads
app.use(express.json({ limit: '10mb' })); // Adjust size if needed
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // For form data
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/user', profileRoutes);

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ideanexus';
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully.'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  });

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the IdeaNexus Backend API!');
});

// Error handling middleware for payload issues
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).send({ message: 'Payload too large. Please reduce the size of your request.' });
  }
  next(err);
});

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
