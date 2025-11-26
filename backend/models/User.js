const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    default: 'male'
  },
  height: {
    type: Number,
    required: true // in cm
  },
  weight: {
    type: Number,
    required: true // in kg
  },
  activityLevel: {
    type: String,
    enum: ['sedentary', 'lightly_active', 'active', 'very_active'],
    default: 'sedentary'
  },
  primaryGoal: {
    type: String,
    enum: ['lose_weight', 'gain_muscle', 'improve_endurance', 'maintain_fitness'],
    required: true
  },
  constraints: {
    type: String,
    default: ''
  },
  workoutLocation: {
    type: String,
    enum: ['home', 'gym'],
    default: 'gym'
  },
  workoutDaysPerWeek: {
    type: Number,
    default: 4,
    min: 3,
    max: 6
  },
  dietaryPreference: {
    type: String,
    enum: ['vegetarian', 'non_vegetarian', 'vegan'],
    default: 'non_vegetarian'
  },
  dietaryRestrictions: {
    type: String,
    default: ''
  },
  hasEquipment: {
    type: Boolean,
    default: true
  },
  focusAreas: [{
    type: String,
    enum: ['strength', 'fat_loss', 'mobility', 'endurance']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

