const express = require('express');
const router  = express.Router();
const Movie   = require('../models/Movie');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/movies  (search + genre filter)
router.get('/', async (req, res) => {
  try {
    const { search, genre, page = 1, limit = 12 } = req.query;
    const query = {};

    if (search) query.$text = { $search: search };
    if (genre)  query.genreIds = genre;

    const skip = (page - 1) * limit;
    const [movies, total] = await Promise.all([
      Movie.find(query).populate('genreIds', 'name').skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      Movie.countDocuments(query),
    ]);

    res.json({ movies, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/movies/:id
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).populate('genreIds', 'name description');
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/movies  (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/movies/:id  (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/movies/:id  (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: 'Movie deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
