// Calculate BMR using Mifflin-St Jeor Equation
const calculateBMR = (weight, height, age, gender) => {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

// Calculate TDEE (Total Daily Energy Expenditure)
const calculateTDEE = (bmr, activityLevel) => {
  const multipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    active: 1.55,
    very_active: 1.725
  };
  return bmr * (multipliers[activityLevel] || 1.2);
};

// Calculate target calories based on goal
const calculateTargetCalories = (tdee, goal) => {
  const adjustments = {
    lose_weight: -500, // 500 calorie deficit
    gain_muscle: 300,  // 300 calorie surplus
    improve_endurance: 0,
    maintain_fitness: 0
  };
  return Math.round(tdee + (adjustments[goal] || 0));
};

// Main function to get calorie recommendation
const getCalorieRecommendation = (user) => {
  const bmr = calculateBMR(user.weight, user.height, user.age, user.gender);
  const tdee = calculateTDEE(bmr, user.activityLevel);
  const targetCalories = calculateTargetCalories(tdee, user.primaryGoal);
  
  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories,
    recommendation: `${targetCalories} kcal/day`
  };
};

module.exports = {
  calculateBMR,
  calculateTDEE,
  calculateTargetCalories,
  getCalorieRecommendation
};

