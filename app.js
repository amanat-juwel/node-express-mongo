const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./utils/database');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

// Connect to MongoDB
connectToDatabase();

// Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
