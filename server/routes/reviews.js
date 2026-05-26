const express = require('express');
const router  = express.Router();
const Review  = require('../models/Review');
const { protect } = require('../middleware/auth');

// GET /api/reviews/movie/:movieId
router.get('/movie/:movieId', async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/reviews
router.post('/', protect, async (req, res) => {
  try {
    const { movieId, rating, comment } = req.body;
    const review = await Review.create({ userId: req.user.id, movieId, rating, comment });
    await review.populate('userId', 'username');
    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: 'You already reviewed this movie' });
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/reviews/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { rating: req.body.rating, comment: req.body.comment },
      { new: true }
    );
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/reviews/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    await Review.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
