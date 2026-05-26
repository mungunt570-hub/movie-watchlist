const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  status:  { type: String, enum: ['want-to-watch', 'watching', 'watched'], default: 'want-to-watch' },
  addedAt: { type: Date, default: Date.now },
});

// A user can only add a movie once
watchlistSchema.index({ userId: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);
