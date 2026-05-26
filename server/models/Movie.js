const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  releaseYear: { type: Number },
  duration:    { type: Number }, // minutes
  poster:      { type: String, default: '' },
  genreIds:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }],
}, { timestamps: true });

// Text index for search
movieSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Movie', movieSchema);
