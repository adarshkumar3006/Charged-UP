const express = require('express');
const authMiddleware = require('../middleware/auth');
const ProgressLog = require('../models/ProgressLog');
const router = express.Router();

// @route   POST /api/progress
// @desc    Add progress log entry
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { date, weight, notes, workoutCompleted } = req.body;
    
    const progressLog = new ProgressLog({
      userId: req.user._id,
      date: date ? new Date(date) : new Date(),
      weight,
      notes: notes || '',
      workoutCompleted: workoutCompleted || false
    });
    
    await progressLog.save();
    res.status(201).json(progressLog);
  } catch (error) {
    console.error('Add progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/progress
// @desc    Get all progress logs for user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const logs = await ProgressLog.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(100);
    
    res.json(logs);
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/progress/stats
// @desc    Get progress statistics
// @access  Private
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const logs = await ProgressLog.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(30);
    
    const workoutLogs = await ProgressLog.find({ 
      userId: req.user._id,
      workoutCompleted: true,
      date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });
    
    const stats = {
      totalEntries: logs.length,
      latestWeight: logs[0]?.weight || null,
      oldestWeight: logs[logs.length - 1]?.weight || null,
      weightChange: logs.length >= 2 ? (logs[0].weight - logs[logs.length - 1].weight).toFixed(1) : 0,
      workoutsLast7Days: workoutLogs.length,
      recentLogs: logs.slice(0, 7)
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Get progress stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/progress/:id
// @desc    Delete progress log entry
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const log = await ProgressLog.findById(req.params.id);
    
    if (!log) {
      return res.status(404).json({ message: 'Progress log not found' });
    }
    
    if (log.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await ProgressLog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Progress log deleted' });
  } catch (error) {
    console.error('Delete progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

