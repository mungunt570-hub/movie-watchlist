const express = require('express');
const router  = express.Router();
const Genre   = require('../models/Genre');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/genres
router.get('/', async (req, res) => {
  try {
    const genres = await Genre.find().sort({ name: 1 });
    res.json(genres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/genres  (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const genre = await Genre.create(req.body);
    res.status(201).json(genre);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/genres/:id  (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Genre.findByIdAndDelete(req.params.id);
    res.json({ message: 'Genre deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
