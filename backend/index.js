const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('/home/rguktongole/Desktop/ideanexus/backend/routes/auth.js'); // Adjust path if necessary
const postRoutes = require('/home/rguktongole/Desktop/ideanexus/backend/routes/posts.js'); // Posts route for dashboard

dotenv.config();

// Log the JWT_SECRET for debugging
if (!process.env.JWT_SECRET) {
  console.error('Error: JWT_SECRET is not defined in the .env file.');
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ideanexus';
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully.'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  });

// Health Check Route
app.get('/', (req, res) => {
  res.send('Welcome to the IdeaNexus Backend API!');
});

// Start the server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
