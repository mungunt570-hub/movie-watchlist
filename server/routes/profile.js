const express = require('express');
const router  = express.Router();
const Profile = require('../models/Profile');
const { protect } = require('../middleware/auth');

// GET /api/profile/me
router.get('/me', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/profile/me
router.put('/me', protect, async (req, res) => {
  try {
    const { fullName, avatar, bio, favoriteGenre } = req.body;
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      { fullName, avatar, bio, favoriteGenre },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
