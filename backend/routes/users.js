const express = require('express');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// @route   GET /api/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/me
// @desc    Update user profile
// @access  Private
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = [
      'name', 'age', 'gender', 'height', 'weight', 'activityLevel',
      'primaryGoal', 'constraints', 'workoutLocation', 'workoutDaysPerWeek',
      'dietaryPreference', 'dietaryRestrictions', 'hasEquipment', 'focusAreas'
    ];
    
    const updateData = {};
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updateData[key] = updates[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

