const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes     = require('./routes/auth');
const movieRoutes    = require('./routes/movies');
const genreRoutes    = require('./routes/genres');
const watchlistRoutes= require('./routes/watchlist');
const reviewRoutes   = require('./routes/reviews');
const profileRoutes  = require('./routes/profile');

const app = express();

// Middleware
app.use(cors({
  origin: [
   'http://localhost:3000',
    'https://movie-watchlist-bay.vercel.app',
    'https://movie-watchlist-9zfigoqyi-mt-s-projects10.vercel.app',
  ],
  credentials: true
}));app.use(express.json());

// Routes
app.use('/api/auth',      authRoutes);
app.use('/api/movies',    movieRoutes);
app.use('/api/genres',    genreRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/reviews',   reviewRoutes);
app.use('/api/profile',   profileRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// Connect DB & start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1);
  });
