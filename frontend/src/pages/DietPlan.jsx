import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./DietPlan.css";

const DietPlan = () => {
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDietPlan();
  }, []);

  const fetchDietPlan = async () => {
    try {
      const res = await axios.get("/api/diet/plan");
      setDietPlan(res.data);
    } catch (error) {
      console.error("Fetch diet plan error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setLoading(true);
    await fetchDietPlan();
  };

  if (loading) {
    return (
      <div className="diet-plan-page">
        <Navbar />
        <div className="container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!dietPlan) {
    return (
      <div className="diet-plan-page">
        <Navbar />
        <div className="container">
          <p>No diet plan available</p>
        </div>
      </div>
    );
  }

  const getDietaryPreferenceDisplay = (pref) => {
    const prefs = {
      vegetarian: "Vegetarian",
      non_vegetarian: "Non-Vegetarian",
      vegan: "Vegan",
    };
    return prefs[pref] || pref;
  };

  return (
    <div className="diet-plan-page">
      <Navbar />
      <div className="container">
        <div className="diet-plan-header">
          <h1>Your Personalized Meal Plan</h1>
          <button onClick={handleRegenerate} className="btn btn-secondary">
            Suggest Another Option
          </button>
        </div>

        <div className="calorie-info-card">
          <h2>Daily Calorie Target</h2>
          <div className="calorie-details">
            <div className="calorie-item">
              <span className="calorie-label">Target Calories</span>
              <span className="calorie-value">
                {dietPlan.targetCalories} kcal/day
              </span>
            </div>
            <div className="calorie-item">
              <span className="calorie-label">BMR</span>
              <span className="calorie-value">
                {dietPlan.calorieInfo.bmr} kcal
              </span>
            </div>
            <div className="calorie-item">
              <span className="calorie-label">TDEE</span>
              <span className="calorie-value">
                {dietPlan.calorieInfo.tdee} kcal
              </span>
            </div>
            <div className="calorie-item">
              <span className="calorie-label">Dietary Preference</span>
              <span className="calorie-value">
                {getDietaryPreferenceDisplay(dietPlan.dietaryPreference)}
              </span>
            </div>
          </div>
        </div>

        <div className="meals-grid">
          <div className="meal-card">
            <div className="meal-header">
              <h2>Breakfast</h2>
              <span className="meal-calories">
                {dietPlan.meals.breakfast.calories} kcal
              </span>
            </div>
            <div className="meal-content">
              <h3>{dietPlan.meals.breakfast.name}</h3>
              <p className="meal-macros">{dietPlan.meals.breakfast.macros}</p>
            </div>
          </div>

          <div className="meal-card">
            <div className="meal-header">
              <h2>Lunch</h2>
              <span className="meal-calories">
                {dietPlan.meals.lunch.calories} kcal
              </span>
            </div>
            <div className="meal-content">
              <h3>{dietPlan.meals.lunch.name}</h3>
              <p className="meal-macros">{dietPlan.meals.lunch.macros}</p>
            </div>
          </div>

          <div className="meal-card">
            <div className="meal-header">
              <h2>Dinner</h2>
              <span className="meal-calories">
                {dietPlan.meals.dinner.calories} kcal
              </span>
            </div>
            <div className="meal-content">
              <h3>{dietPlan.meals.dinner.name}</h3>
              <p className="meal-macros">{dietPlan.meals.dinner.macros}</p>
            </div>
          </div>

          <div className="meal-card">
            <div className="meal-header">
              <h2>Snacks</h2>
              <span className="meal-calories">
                {dietPlan.meals.snacks.calories} kcal
              </span>
            </div>
            <div className="meal-content">
              <h3>{dietPlan.meals.snacks.name}</h3>
              <p className="meal-macros">{dietPlan.meals.snacks.macros}</p>
            </div>
          </div>
        </div>

        <div className="total-calories">
          <h3>Total Daily Calories</h3>
          <p className="total-value">
            {dietPlan.meals.breakfast.calories +
              dietPlan.meals.lunch.calories +
              dietPlan.meals.dinner.calories +
              dietPlan.meals.snacks.calories}{" "}
            kcal
          </p>
        </div>
      </div>
    </div>
  );
};

export default DietPlan;
