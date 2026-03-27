const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Unified response format
app.use((req, res, next) => {
  res.success = (data) => res.json({ code: 0, message: 'success', data });
  res.error = (message, code = 1) => res.json({ code, message });
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ code: 500, message: 'Internal Server Error' });
});

// Test route
app.get('/', (req, res) => {
  res.success({ message: 'Server is running!' });
});

// User routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);

// Course routes
const courseRoutes = require('./routes/courseRoutes');
app.use('/api/course', courseRoutes);

// Video routes
const videoRoutes = require('./routes/videoRoutes');
app.use('/api/video', videoRoutes);

// Comment routes
const commentRoutes = require('./routes/commentRoutes');
app.use('/api/comment', commentRoutes);

// Favorite routes
const favoriteRoutes = require('./routes/favoriteRoutes');
app.use('/api/favorite', favoriteRoutes);

// Learn routes
const learnRoutes = require('./routes/learnRoutes');
app.use('/api/learn', learnRoutes);

// Admin routes
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});