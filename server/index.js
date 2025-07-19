const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();

// Middleware
app.use(cors());
app.use(compression()); // Enable gzip compression
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/personal-posts-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
} else {
  // Basic route for testing in development
  app.get('/', (req, res) => {
    res.json({ message: 'Personal Posts API is running!' });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 