const express = require('express');
const authMiddleware = require('../middleware/auth');
const { getCalorieRecommendation } = require('../utils/calorieCalculator');
const User = require('../models/User');
const router = express.Router();

// Meal templates organized by calorie range and dietary preference
const mealTemplates = {
  vegetarian: {
    '1500-1800': {
      breakfast: { name: 'Oats with Banana & Nuts', calories: 350, macros: 'Carbs: 60g, Protein: 12g, Fat: 8g' },
      lunch: { name: 'Dal Rice with Vegetables', calories: 500, macros: 'Carbs: 80g, Protein: 20g, Fat: 10g' },
      dinner: { name: 'Paneer Curry with Roti', calories: 450, macros: 'Carbs: 50g, Protein: 25g, Fat: 15g' },
      snacks: { name: 'Yogurt with Fruits', calories: 200, macros: 'Carbs: 30g, Protein: 10g, Fat: 5g' }
    },
    '1800-2100': {
      breakfast: { name: 'Scrambled Eggs (2) with Toast & Avocado', calories: 400, macros: 'Carbs: 45g, Protein: 20g, Fat: 18g' },
      lunch: { name: 'Chickpea Curry with Brown Rice', calories: 600, macros: 'Carbs: 90g, Protein: 25g, Fat: 12g' },
      dinner: { name: 'Tofu Stir Fry with Quinoa', calories: 550, macros: 'Carbs: 60g, Protein: 30g, Fat: 15g' },
      snacks: { name: 'Mixed Nuts & Greek Yogurt', calories: 250, macros: 'Carbs: 15g, Protein: 15g, Fat: 18g' }
    },
    '2100-2400': {
      breakfast: { name: 'Protein Smoothie Bowl', calories: 450, macros: 'Carbs: 60g, Protein: 25g, Fat: 12g' },
      lunch: { name: 'Paneer Tikka with Rice & Salad', calories: 650, macros: 'Carbs: 85g, Protein: 35g, Fat: 18g' },
      dinner: { name: 'Lentil Curry with Roti & Vegetables', calories: 600, macros: 'Carbs: 75g, Protein: 28g, Fat: 15g' },
      snacks: { name: 'Protein Bar & Apple', calories: 300, macros: 'Carbs: 40g, Protein: 20g, Fat: 10g' }
    },
    '2400-2700': {
      breakfast: { name: 'Oats with Protein Powder & Berries', calories: 500, macros: 'Carbs: 70g, Protein: 30g, Fat: 12g' },
      lunch: { name: 'Paneer Biryani with Raita', calories: 750, macros: 'Carbs: 100g, Protein: 35g, Fat: 20g' },
      dinner: { name: 'Tofu & Vegetable Curry with Rice', calories: 700, macros: 'Carbs: 85g, Protein: 32g, Fat: 18g' },
      snacks: { name: 'Trail Mix & Protein Shake', calories: 350, macros: 'Carbs: 45g, Protein: 25g, Fat: 15g' }
    }
  },
  non_vegetarian: {
    '1500-1800': {
      breakfast: { name: 'Scrambled Eggs (2) with Whole Wheat Toast', calories: 350, macros: 'Carbs: 35g, Protein: 20g, Fat: 12g' },
      lunch: { name: 'Grilled Chicken Breast with Brown Rice & Vegetables', calories: 500, macros: 'Carbs: 50g, Protein: 40g, Fat: 10g' },
      dinner: { name: 'Baked Fish with Quinoa & Steamed Vegetables', calories: 450, macros: 'Carbs: 40g, Protein: 35g, Fat: 12g' },
      snacks: { name: 'Greek Yogurt with Berries', calories: 200, macros: 'Carbs: 25g, Protein: 15g, Fat: 5g' }
    },
    '1800-2100': {
      breakfast: { name: 'Omelette (3 eggs) with Vegetables & Toast', calories: 400, macros: 'Carbs: 30g, Protein: 25g, Fat: 18g' },
      lunch: { name: 'Grilled Chicken with Sweet Potato & Broccoli', calories: 600, macros: 'Carbs: 60g, Protein: 45g, Fat: 15g' },
      dinner: { name: 'Salmon with Brown Rice & Asparagus', calories: 550, macros: 'Carbs: 50g, Protein: 40g, Fat: 18g' },
      snacks: { name: 'Protein Shake & Almonds', calories: 250, macros: 'Carbs: 20g, Protein: 25g, Fat: 12g' }
    },
    '2100-2400': {
      breakfast: { name: 'Protein Pancakes with Eggs & Turkey Bacon', calories: 450, macros: 'Carbs: 50g, Protein: 30g, Fat: 15g' },
      lunch: { name: 'Chicken Breast with Rice, Beans & Salad', calories: 650, macros: 'Carbs: 70g, Protein: 50g, Fat: 18g' },
      dinner: { name: 'Lean Beef Steak with Quinoa & Vegetables', calories: 600, macros: 'Carbs: 55g, Protein: 45g, Fat: 20g' },
      snacks: { name: 'Protein Bar & Banana', calories: 300, macros: 'Carbs: 40g, Protein: 20g, Fat: 10g' }
    },
    '2400-2700': {
      breakfast: { name: 'High Protein Breakfast Bowl (Eggs, Chicken, Avocado)', calories: 500, macros: 'Carbs: 40g, Protein: 40g, Fat: 22g' },
      lunch: { name: 'Chicken & Rice Bowl with Vegetables', calories: 750, macros: 'Carbs: 85g, Protein: 55g, Fat: 20g' },
      dinner: { name: 'Grilled Salmon with Pasta & Vegetables', calories: 700, macros: 'Carbs: 70g, Protein: 50g, Fat: 25g' },
      snacks: { name: 'Protein Shake & Mixed Nuts', calories: 350, macros: 'Carbs: 30g, Protein: 30g, Fat: 18g' }
    }
  },
  vegan: {
    '1500-1800': {
      breakfast: { name: 'Overnight Oats with Chia Seeds & Berries', calories: 350, macros: 'Carbs: 65g, Protein: 12g, Fat: 8g' },
      lunch: { name: 'Lentil Soup with Whole Grain Bread', calories: 500, macros: 'Carbs: 75g, Protein: 22g, Fat: 10g' },
      dinner: { name: 'Tofu Stir Fry with Brown Rice', calories: 450, macros: 'Carbs: 55g, Protein: 20g, Fat: 12g' },
      snacks: { name: 'Hummus with Veggie Sticks', calories: 200, macros: 'Carbs: 25g, Protein: 8g, Fat: 8g' }
    },
    '1800-2100': {
      breakfast: { name: 'Smoothie Bowl (Banana, Spinach, Protein Powder)', calories: 400, macros: 'Carbs: 60g, Protein: 25g, Fat: 10g' },
      lunch: { name: 'Chickpea & Quinoa Salad', calories: 600, macros: 'Carbs: 85g, Protein: 28g, Fat: 15g' },
      dinner: { name: 'Tempeh with Vegetables & Rice', calories: 550, macros: 'Carbs: 65g, Protein: 28g, Fat: 15g' },
      snacks: { name: 'Almonds & Apple', calories: 250, macros: 'Carbs: 30g, Protein: 8g, Fat: 15g' }
    },
    '2100-2400': {
      breakfast: { name: 'Vegan Protein Pancakes with Nut Butter', calories: 450, macros: 'Carbs: 55g, Protein: 25g, Fat: 18g' },
      lunch: { name: 'Black Bean Burger with Sweet Potato Fries', calories: 650, macros: 'Carbs: 90g, Protein: 30g, Fat: 18g' },
      dinner: { name: 'Lentil Curry with Quinoa & Vegetables', calories: 600, macros: 'Carbs: 80g, Protein: 30g, Fat: 15g' },
      snacks: { name: 'Vegan Protein Bar & Banana', calories: 300, macros: 'Carbs: 45g, Protein: 20g, Fat: 10g' }
    },
    '2400-2700': {
      breakfast: { name: 'High Protein Smoothie with Oats', calories: 500, macros: 'Carbs: 70g, Protein: 30g, Fat: 12g' },
      lunch: { name: 'Tofu & Vegetable Bowl with Rice', calories: 750, macros: 'Carbs: 100g, Protein: 35g, Fat: 20g' },
      dinner: { name: 'Lentil Pasta with Vegetables & Sauce', calories: 700, macros: 'Carbs: 90g, Protein: 32g, Fat: 18g' },
      snacks: { name: 'Trail Mix & Protein Shake', calories: 350, macros: 'Carbs: 50g, Protein: 25g, Fat: 15g' }
    }
  }
};

// Get calorie range key
const getCalorieRange = (calories) => {
  if (calories < 1500) return '1500-1800';
  if (calories < 1800) return '1500-1800';
  if (calories < 2100) return '1800-2100';
  if (calories < 2400) return '2100-2400';
  if (calories < 2700) return '2400-2700';
  return '2400-2700';
};

// @route   GET /api/diet/plan
// @desc    Get personalized diet plan
// @access  Private
router.get('/plan', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const calorieData = getCalorieRecommendation(user);
    const targetCalories = calorieData.targetCalories;
    const calorieRange = getCalorieRange(targetCalories);
    const dietaryPreference = user.dietaryPreference || 'non_vegetarian';
    
    const meals = mealTemplates[dietaryPreference]?.[calorieRange] || mealTemplates.non_vegetarian['1800-2100'];
    
    res.json({
      meals,
      calorieInfo: calorieData,
      dietaryPreference,
      targetCalories
    });
  } catch (error) {
    console.error('Get diet plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/diet/today
// @desc    Get today's meal suggestions
// @access  Private
router.get('/today', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const calorieData = getCalorieRecommendation(user);
    const targetCalories = calorieData.targetCalories;
    const calorieRange = getCalorieRange(targetCalories);
    const dietaryPreference = user.dietaryPreference || 'non_vegetarian';
    
    const meals = mealTemplates[dietaryPreference]?.[calorieRange] || mealTemplates.non_vegetarian['1800-2100'];
    
    res.json({
      meals,
      calorieInfo: calorieData,
      dietaryPreference
    });
  } catch (error) {
    console.error('Get today diet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

