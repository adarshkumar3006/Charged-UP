const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router();

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production', {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('age').custom((value) => {
    const num = parseInt(value);
    if (isNaN(num) || num < 13 || num > 100) {
      throw new Error('Age must be between 13 and 100');
    }
    return true;
  }),
  body('height').custom((value) => {
    const num = parseFloat(value);
    if (isNaN(num) || num < 100 || num > 250) {
      throw new Error('Height must be between 100 and 250 cm');
    }
    return true;
  }),
  body('weight').custom((value) => {
    const num = parseFloat(value);
    if (isNaN(num) || num < 30 || num > 300) {
      throw new Error('Weight must be between 30 and 300 kg');
    }
    return true;
  }),
  body('primaryGoal').isIn(['lose_weight', 'gain_muscle', 'improve_endurance', 'maintain_fitness']).withMessage('Invalid primary goal')
], async (req, res) => {
  try {
    // Check MongoDB connection
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database not connected. Please make sure MongoDB is running and try again.' 
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: errors.array().map(e => e.msg).join(', '),
        errors: errors.array() 
      });
    }

    const { name, email, password, age, gender, height, weight, activityLevel, primaryGoal, constraints } = req.body;
    
    // Validate and convert to proper types
    if (!name || !email || !password || !age || !height || !weight || !primaryGoal) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      age: parseInt(age),
      gender: gender || 'male',
      height: parseFloat(height),
      weight: parseFloat(weight),
      activityLevel: activityLevel || 'sedentary',
      primaryGoal,
      constraints: constraints || ''
    };

    // Validate numeric values
    if (isNaN(userData.age) || userData.age < 13 || userData.age > 100) {
      return res.status(400).json({ message: 'Age must be between 13 and 100' });
    }
    if (isNaN(userData.height) || userData.height < 100 || userData.height > 250) {
      return res.status(400).json({ message: 'Height must be between 100 and 250 cm' });
    }
    if (isNaN(userData.weight) || userData.weight < 30 || userData.weight > 300) {
      return res.status(400).json({ message: 'Weight must be between 30 and 300 kg' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const user = new User(userData);

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        primaryGoal: user.primaryGoal
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    console.error('Error stack:', error.stack);
    
    // Handle MongoDB connection errors
    if (error.name === 'MongoServerSelectionError' || error.message?.includes('connect')) {
      return res.status(503).json({ 
        message: 'Database connection failed. Please make sure MongoDB is running.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    // Provide more specific error messages
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    
    if (error.code === 11000 || (error.name === 'MongoServerError' && error.code === 11000)) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    // Handle CastError (invalid data types)
    if (error.name === 'CastError') {
      return res.status(400).json({ message: `Invalid ${error.path}: ${error.value}` });
    }
    
    // Log full error for debugging
    console.error('Full error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    res.status(500).json({ 
      message: 'Server error during signup. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        primaryGoal: user.primaryGoal
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;

