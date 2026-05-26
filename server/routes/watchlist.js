const express   = require('express');
const router    = express.Router();
const Watchlist = require('../models/Watchlist');
const { protect } = require('../middleware/auth');

// GET /api/watchlist  — current user's list
router.get('/', protect, async (req, res) => {
  try {
    const items = await Watchlist.find({ userId: req.user.id })
      .populate({ path: 'movieId', populate: { path: 'genreIds', select: 'name' } })
      .sort({ addedAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/watchlist  — add a movie
router.post('/', protect, async (req, res) => {
  try {
    const { movieId, status } = req.body;
    const item = await Watchlist.create({ userId: req.user.id, movieId, status });
    res.status(201).json(item);
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: 'Movie already in watchlist' });
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/watchlist/:id  — update status
router.put('/:id', protect, async (req, res) => {
  try {
    const item = await Watchlist.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status: req.body.status },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/watchlist/:id  — remove from list
router.delete('/:id', protect, async (req, res) => {
  try {
    await Watchlist.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Removed from watchlist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
