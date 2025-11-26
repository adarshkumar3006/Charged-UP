const express = require('express');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Workout templates based on goals and equipment
const workoutTemplates = {
  lose_weight: {
    gym: {
      beginner: [
        { day: 1, name: 'Full Body Circuit', exercises: [
          { name: 'Squats', sets: 3, reps: 12, rest: '60s' },
          { name: 'Bench Press', sets: 3, reps: 10, rest: '60s' },
          { name: 'Bent Over Rows', sets: 3, reps: 10, rest: '60s' },
          { name: 'Leg Press', sets: 3, reps: 15, rest: '45s' },
          { name: 'Cardio (Treadmill)', sets: 1, reps: '20 min', rest: '-' }
        ]},
        { day: 2, name: 'Cardio & Core', exercises: [
          { name: 'Running', sets: 1, reps: '30 min', rest: '-' },
          { name: 'Plank', sets: 3, reps: '45s', rest: '30s' },
          { name: 'Crunches', sets: 3, reps: 20, rest: '30s' },
          { name: 'Mountain Climbers', sets: 3, reps: 30, rest: '30s' }
        ]},
        { day: 3, name: 'Upper Body Focus', exercises: [
          { name: 'Push-ups', sets: 3, reps: 12, rest: '45s' },
          { name: 'Lat Pulldowns', sets: 3, reps: 12, rest: '60s' },
          { name: 'Shoulder Press', sets: 3, reps: 10, rest: '60s' },
          { name: 'Bicep Curls', sets: 3, reps: 12, rest: '45s' }
        ]},
        { day: 4, name: 'Lower Body & Cardio', exercises: [
          { name: 'Squats', sets: 4, reps: 15, rest: '60s' },
          { name: 'Lunges', sets: 3, reps: 12, rest: '45s' },
          { name: 'Leg Curls', sets: 3, reps: 12, rest: '45s' },
          { name: 'Cycling', sets: 1, reps: '25 min', rest: '-' }
        ]}
      ],
      intermediate: [
        { day: 1, name: 'Push Day', exercises: [
          { name: 'Bench Press', sets: 4, reps: 8, rest: '90s' },
          { name: 'Incline Dumbbell Press', sets: 3, reps: 10, rest: '75s' },
          { name: 'Shoulder Press', sets: 3, reps: 10, rest: '75s' },
          { name: 'Tricep Dips', sets: 3, reps: 12, rest: '60s' },
          { name: 'Cardio (HIIT)', sets: 1, reps: '15 min', rest: '-' }
        ]},
        { day: 2, name: 'Pull Day', exercises: [
          { name: 'Deadlifts', sets: 4, reps: 6, rest: '120s' },
          { name: 'Pull-ups', sets: 3, reps: 8, rest: '90s' },
          { name: 'Barbell Rows', sets: 3, reps: 10, rest: '75s' },
          { name: 'Bicep Curls', sets: 3, reps: 12, rest: '60s' }
        ]},
        { day: 3, name: 'Leg Day', exercises: [
          { name: 'Squats', sets: 4, reps: 10, rest: '90s' },
          { name: 'Romanian Deadlifts', sets: 3, reps: 10, rest: '90s' },
          { name: 'Leg Press', sets: 3, reps: 15, rest: '60s' },
          { name: 'Leg Curls', sets: 3, reps: 12, rest: '60s' },
          { name: 'Cardio (Stairmaster)', sets: 1, reps: '20 min', rest: '-' }
        ]},
        { day: 4, name: 'Full Body HIIT', exercises: [
          { name: 'Burpees', sets: 4, reps: 10, rest: '45s' },
          { name: 'Kettlebell Swings', sets: 3, reps: 15, rest: '45s' },
          { name: 'Battle Ropes', sets: 3, reps: '30s', rest: '30s' },
          { name: 'Box Jumps', sets: 3, reps: 12, rest: '60s' }
        ]}
      ]
    },
    home: {
      beginner: [
        { day: 1, name: 'Bodyweight Full Body', exercises: [
          { name: 'Bodyweight Squats', sets: 3, reps: 15, rest: '45s' },
          { name: 'Push-ups', sets: 3, reps: 10, rest: '45s' },
          { name: 'Plank', sets: 3, reps: '30s', rest: '30s' },
          { name: 'Jumping Jacks', sets: 3, reps: 30, rest: '30s' },
          { name: 'Lunges', sets: 3, reps: 12, rest: '45s' }
        ]},
        { day: 2, name: 'Cardio Day', exercises: [
          { name: 'High Knees', sets: 3, reps: '30s', rest: '30s' },
          { name: 'Burpees', sets: 3, reps: 8, rest: '45s' },
          { name: 'Mountain Climbers', sets: 3, reps: 20, rest: '30s' },
          { name: 'Jump Rope (simulated)', sets: 3, reps: '60s', rest: '30s' }
        ]},
        { day: 3, name: 'Core Focus', exercises: [
          { name: 'Crunches', sets: 3, reps: 20, rest: '30s' },
          { name: 'Plank', sets: 3, reps: '45s', rest: '30s' },
          { name: 'Russian Twists', sets: 3, reps: 20, rest: '30s' },
          { name: 'Leg Raises', sets: 3, reps: 15, rest: '30s' }
        ]},
        { day: 4, name: 'Upper Body', exercises: [
          { name: 'Push-ups', sets: 3, reps: 12, rest: '45s' },
          { name: 'Diamond Push-ups', sets: 2, reps: 8, rest: '45s' },
          { name: 'Pike Push-ups', sets: 3, reps: 10, rest: '45s' },
          { name: 'Plank Shoulder Taps', sets: 3, reps: 20, rest: '30s' }
        ]}
      ]
    }
  },
  gain_muscle: {
    gym: {
      beginner: [
        { day: 1, name: 'Push Day', exercises: [
          { name: 'Bench Press', sets: 4, reps: 8, rest: '90s' },
          { name: 'Incline Dumbbell Press', sets: 3, reps: 10, rest: '75s' },
          { name: 'Shoulder Press', sets: 3, reps: 10, rest: '75s' },
          { name: 'Tricep Extensions', sets: 3, reps: 12, rest: '60s' },
          { name: 'Lateral Raises', sets: 3, reps: 12, rest: '45s' }
        ]},
        { day: 2, name: 'Pull Day', exercises: [
          { name: 'Deadlifts', sets: 4, reps: 6, rest: '120s' },
          { name: 'Pull-ups', sets: 3, reps: 8, rest: '90s' },
          { name: 'Barbell Rows', sets: 3, reps: 10, rest: '75s' },
          { name: 'Bicep Curls', sets: 3, reps: 12, rest: '60s' },
          { name: 'Hammer Curls', sets: 3, reps: 12, rest: '60s' }
        ]},
        { day: 3, name: 'Leg Day', exercises: [
          { name: 'Squats', sets: 4, reps: 8, rest: '120s' },
          { name: 'Romanian Deadlifts', sets: 3, reps: 10, rest: '90s' },
          { name: 'Leg Press', sets: 3, reps: 12, rest: '75s' },
          { name: 'Leg Curls', sets: 3, reps: 12, rest: '60s' },
          { name: 'Calf Raises', sets: 3, reps: 15, rest: '45s' }
        ]},
        { day: 4, name: 'Rest Day', exercises: [] }
      ],
      intermediate: [
        { day: 1, name: 'Chest & Triceps', exercises: [
          { name: 'Bench Press', sets: 5, reps: 5, rest: '120s' },
          { name: 'Incline Dumbbell Press', sets: 4, reps: 8, rest: '90s' },
          { name: 'Cable Flyes', sets: 3, reps: 12, rest: '60s' },
          { name: 'Close Grip Bench Press', sets: 3, reps: 8, rest: '90s' },
          { name: 'Tricep Pushdowns', sets: 3, reps: 12, rest: '60s' }
        ]},
        { day: 2, name: 'Back & Biceps', exercises: [
          { name: 'Deadlifts', sets: 5, reps: 5, rest: '180s' },
          { name: 'Pull-ups', sets: 4, reps: 8, rest: '90s' },
          { name: 'Barbell Rows', sets: 4, reps: 8, rest: '90s' },
          { name: 'T-Bar Rows', sets: 3, reps: 10, rest: '75s' },
          { name: 'Barbell Curls', sets: 3, reps: 10, rest: '60s' },
          { name: 'Hammer Curls', sets: 3, reps: 12, rest: '60s' }
        ]},
        { day: 3, name: 'Legs & Glutes', exercises: [
          { name: 'Squats', sets: 5, reps: 5, rest: '180s' },
          { name: 'Romanian Deadlifts', sets: 4, reps: 8, rest: '120s' },
          { name: 'Leg Press', sets: 4, reps: 12, rest: '90s' },
          { name: 'Leg Extensions', sets: 3, reps: 12, rest: '60s' },
          { name: 'Leg Curls', sets: 3, reps: 12, rest: '60s' },
          { name: 'Calf Raises', sets: 4, reps: 15, rest: '45s' }
        ]},
        { day: 4, name: 'Shoulders & Arms', exercises: [
          { name: 'Overhead Press', sets: 4, reps: 8, rest: '90s' },
          { name: 'Lateral Raises', sets: 4, reps: 12, rest: '60s' },
          { name: 'Rear Delt Flyes', sets: 3, reps: 12, rest: '60s' },
          { name: 'Bicep Curls', sets: 3, reps: 10, rest: '60s' },
          { name: 'Tricep Extensions', sets: 3, reps: 12, rest: '60s' }
        ]}
      ]
    },
    home: {
      beginner: [
        { day: 1, name: 'Upper Body', exercises: [
          { name: 'Push-ups', sets: 4, reps: 12, rest: '60s' },
          { name: 'Diamond Push-ups', sets: 3, reps: 10, rest: '60s' },
          { name: 'Pike Push-ups', sets: 3, reps: 10, rest: '60s' },
          { name: 'Pull-ups (if available)', sets: 3, reps: 8, rest: '90s' },
          { name: 'Plank', sets: 3, reps: '60s', rest: '45s' }
        ]},
        { day: 2, name: 'Lower Body', exercises: [
          { name: 'Squats', sets: 4, reps: 15, rest: '60s' },
          { name: 'Lunges', sets: 3, reps: 12, rest: '60s' },
          { name: 'Jump Squats', sets: 3, reps: 10, rest: '60s' },
          { name: 'Glute Bridges', sets: 3, reps: 15, rest: '45s' },
          { name: 'Calf Raises', sets: 3, reps: 20, rest: '45s' }
        ]},
        { day: 3, name: 'Full Body', exercises: [
          { name: 'Burpees', sets: 3, reps: 10, rest: '60s' },
          { name: 'Mountain Climbers', sets: 3, reps: 30, rest: '45s' },
          { name: 'Plank to Push-up', sets: 3, reps: 10, rest: '60s' },
          { name: 'Jumping Lunges', sets: 3, reps: 12, rest: '60s' }
        ]},
        { day: 4, name: 'Rest Day', exercises: [] }
      ]
    }
  },
  improve_endurance: {
    gym: {
      beginner: [
        { day: 1, name: 'Cardio & Strength', exercises: [
          { name: 'Running', sets: 1, reps: '20 min', rest: '-' },
          { name: 'Squats', sets: 3, reps: 15, rest: '45s' },
          { name: 'Push-ups', sets: 3, reps: 12, rest: '45s' },
          { name: 'Plank', sets: 3, reps: '45s', rest: '30s' }
        ]},
        { day: 2, name: 'Endurance Circuit', exercises: [
          { name: 'Cycling', sets: 1, reps: '30 min', rest: '-' },
          { name: 'Bodyweight Squats', sets: 3, reps: 20, rest: '30s' },
          { name: 'Jumping Jacks', sets: 3, reps: 40, rest: '30s' }
        ]},
        { day: 3, name: 'HIIT Training', exercises: [
          { name: 'Sprint Intervals', sets: 6, reps: '30s on/30s off', rest: '30s' },
          { name: 'Burpees', sets: 3, reps: 10, rest: '45s' },
          { name: 'Mountain Climbers', sets: 3, reps: 30, rest: '30s' }
        ]},
        { day: 4, name: 'Long Distance', exercises: [
          { name: 'Running', sets: 1, reps: '40 min', rest: '-' },
          { name: 'Stretching', sets: 1, reps: '10 min', rest: '-' }
        ]}
      ]
    },
    home: {
      beginner: [
        { day: 1, name: 'Cardio Blast', exercises: [
          { name: 'Jumping Jacks', sets: 4, reps: 30, rest: '30s' },
          { name: 'High Knees', sets: 4, reps: '30s', rest: '30s' },
          { name: 'Burpees', sets: 3, reps: 10, rest: '45s' },
          { name: 'Mountain Climbers', sets: 3, reps: 30, rest: '30s' }
        ]},
        { day: 2, name: 'Endurance Run', exercises: [
          { name: 'Running (outdoor)', sets: 1, reps: '30 min', rest: '-' },
          { name: 'Walking', sets: 1, reps: '10 min', rest: '-' }
        ]},
        { day: 3, name: 'HIIT Circuit', exercises: [
          { name: 'Sprint in Place', sets: 6, reps: '30s', rest: '30s' },
          { name: 'Jump Squats', sets: 3, reps: 15, rest: '45s' },
          { name: 'Plank', sets: 3, reps: '60s', rest: '30s' }
        ]},
        { day: 4, name: 'Active Recovery', exercises: [
          { name: 'Yoga/Stretching', sets: 1, reps: '30 min', rest: '-' },
          { name: 'Light Walking', sets: 1, reps: '20 min', rest: '-' }
        ]}
      ]
    }
  },
  maintain_fitness: {
    gym: {
      beginner: [
        { day: 1, name: 'Full Body', exercises: [
          { name: 'Squats', sets: 3, reps: 12, rest: '60s' },
          { name: 'Bench Press', sets: 3, reps: 10, rest: '60s' },
          { name: 'Rows', sets: 3, reps: 10, rest: '60s' },
          { name: 'Shoulder Press', sets: 3, reps: 10, rest: '60s' }
        ]},
        { day: 2, name: 'Cardio', exercises: [
          { name: 'Running', sets: 1, reps: '25 min', rest: '-' },
          { name: 'Cycling', sets: 1, reps: '15 min', rest: '-' }
        ]},
        { day: 3, name: 'Upper Body', exercises: [
          { name: 'Push-ups', sets: 3, reps: 12, rest: '45s' },
          { name: 'Pull-ups', sets: 3, reps: 8, rest: '90s' },
          { name: 'Dips', sets: 3, reps: 10, rest: '60s' }
        ]},
        { day: 4, name: 'Lower Body', exercises: [
          { name: 'Squats', sets: 3, reps: 15, rest: '60s' },
          { name: 'Lunges', sets: 3, reps: 12, rest: '45s' },
          { name: 'Leg Press', sets: 3, reps: 15, rest: '60s' }
        ]}
      ]
    },
    home: {
      beginner: [
        { day: 1, name: 'Full Body', exercises: [
          { name: 'Squats', sets: 3, reps: 15, rest: '45s' },
          { name: 'Push-ups', sets: 3, reps: 12, rest: '45s' },
          { name: 'Plank', sets: 3, reps: '45s', rest: '30s' },
          { name: 'Lunges', sets: 3, reps: 12, rest: '45s' }
        ]},
        { day: 2, name: 'Cardio', exercises: [
          { name: 'Jumping Jacks', sets: 3, reps: 30, rest: '30s' },
          { name: 'Burpees', sets: 3, reps: 8, rest: '45s' },
          { name: 'High Knees', sets: 3, reps: '30s', rest: '30s' }
        ]},
        { day: 3, name: 'Strength', exercises: [
          { name: 'Push-ups', sets: 4, reps: 12, rest: '60s' },
          { name: 'Bodyweight Squats', sets: 4, reps: 15, rest: '60s' },
          { name: 'Plank', sets: 3, reps: '60s', rest: '45s' }
        ]},
        { day: 4, name: 'Active Recovery', exercises: [
          { name: 'Yoga', sets: 1, reps: '20 min', rest: '-' },
          { name: 'Stretching', sets: 1, reps: '15 min', rest: '-' }
        ]}
      ]
    }
  }
};

// Determine user level based on workout days and experience
const getUserLevel = (user) => {
  if (user.workoutDaysPerWeek >= 5) {
    return 'intermediate';
  }
  return 'beginner';
};

// @route   GET /api/workout/plan
// @desc    Get personalized workout plan
// @access  Private
router.get('/plan', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const location = user.workoutLocation || 'gym';
    const level = getUserLevel(user);
    const goal = user.primaryGoal || 'maintain_fitness';
    
    const template = workoutTemplates[goal]?.[location]?.[level] || workoutTemplates.maintain_fitness.gym.beginner;
    
    // Adjust for workout days per week
    const daysPerWeek = user.workoutDaysPerWeek || 4;
    const plan = template.slice(0, daysPerWeek);
    
    res.json({
      plan,
      level,
      location,
      goal: user.primaryGoal,
      daysPerWeek
    });
  } catch (error) {
    console.error('Get workout plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/workout/today
// @desc    Get today's workout
// @access  Private
router.get('/today', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const location = user.workoutLocation || 'gym';
    const level = getUserLevel(user);
    const goal = user.primaryGoal || 'maintain_fitness';
    
    const template = workoutTemplates[goal]?.[location]?.[level] || workoutTemplates.maintain_fitness.gym.beginner;
    
    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    const dayOfWeek = new Date().getDay();
    const daysPerWeek = user.workoutDaysPerWeek || 4;
    
    // Map day of week to workout day (assuming workouts start on Monday)
    let workoutDayIndex = (dayOfWeek === 0 ? 7 : dayOfWeek) - 1; // Convert Sunday (0) to 7, then subtract 1
    workoutDayIndex = workoutDayIndex % daysPerWeek;
    
    const todayWorkout = template[workoutDayIndex] || template[0];
    
    res.json({
      workout: todayWorkout,
      day: workoutDayIndex + 1,
      level,
      location
    });
  } catch (error) {
    console.error('Get today workout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

