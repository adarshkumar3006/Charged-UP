import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [todayWorkout, setTodayWorkout] = useState(null);
  const [todayDiet, setTodayDiet] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [workoutRes, dietRes, statsRes] = await Promise.all([
        axios.get("/api/workout/today"),
        axios.get("/api/diet/today"),
        axios.get("/api/progress/stats"),
      ]);

      setTodayWorkout(workoutRes.data);
      setTodayDiet(dietRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error("Dashboard data error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getGoalDisplay = (goal) => {
    const goals = {
      lose_weight: "Lose Weight",
      gain_muscle: "Gain Muscle",
      improve_endurance: "Improve Endurance",
      maintain_fitness: "Maintain Fitness",
    };
    return goals[goal] || goal;
  };

  if (loading) {
    return (
      <div className="dashboard">
        <Navbar />
        <div className="container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Navbar />
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.name} </h1>
          <p className="dashboard-subtitle">
            Here's your personalized fitness overview
          </p>
        </div>

        <div className="dashboard-summary">
          <div className="summary-card">
            <div className="summary-label">Current Goal</div>
            <div className="summary-value">
              {getGoalDisplay(user?.primaryGoal)}
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Target Calories</div>
            <div className="summary-value">
              {todayDiet?.calorieInfo?.targetCalories || "N/A"} kcal
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Workout Frequency</div>
            <div className="summary-value">
              {user?.workoutDaysPerWeek || 4} days/week
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h2>Today's Workout Plan</h2>
            {todayWorkout?.workout ? (
              <>
                <h3 className="workout-name">{todayWorkout.workout.name}</h3>
                <div className="workout-exercises">
                  {todayWorkout.workout.exercises
                    .slice(0, 3)
                    .map((exercise, idx) => (
                      <div key={idx} className="exercise-item">
                        <span className="exercise-name">{exercise.name}</span>
                        <span className="exercise-details">
                          {exercise.sets} sets × {exercise.reps}
                        </span>
                      </div>
                    ))}
                  {todayWorkout.workout.exercises.length > 3 && (
                    <p className="more-exercises">
                      +{todayWorkout.workout.exercises.length - 3} more
                      exercises
                    </p>
                  )}
                </div>
                <Link to="/workout-plan" className="btn btn-primary">
                  View Full Plan
                </Link>
              </>
            ) : (
              <p>No workout scheduled for today</p>
            )}
          </div>

          <div className="dashboard-card">
            <h2>Today's Diet Suggestion</h2>
            {todayDiet?.meals ? (
              <>
                <div className="diet-meals">
                  <div className="meal-item">
                    <span className="meal-type">Breakfast</span>
                    <span className="meal-name">
                      {todayDiet.meals.breakfast.name}
                    </span>
                    <span className="meal-calories">
                      {todayDiet.meals.breakfast.calories} kcal
                    </span>
                  </div>
                  <div className="meal-item">
                    <span className="meal-type">Lunch</span>
                    <span className="meal-name">
                      {todayDiet.meals.lunch.name}
                    </span>
                    <span className="meal-calories">
                      {todayDiet.meals.lunch.calories} kcal
                    </span>
                  </div>
                  <div className="meal-item">
                    <span className="meal-type">Dinner</span>
                    <span className="meal-name">
                      {todayDiet.meals.dinner.name}
                    </span>
                    <span className="meal-calories">
                      {todayDiet.meals.dinner.calories} kcal
                    </span>
                  </div>
                </div>
                <Link to="/diet-plan" className="btn btn-primary">
                  View Meal Plan
                </Link>
              </>
            ) : (
              <p>Loading meal suggestions...</p>
            )}
          </div>

          <div className="dashboard-card">
            <h2>Progress Snapshot</h2>
            {stats ? (
              <>
                <div className="progress-stats">
                  <div className="stat-item">
                    <span className="stat-label">Latest Weight</span>
                    <span className="stat-value">
                      {stats.latestWeight
                        ? `${stats.latestWeight} kg`
                        : "Not recorded"}
                    </span>
                  </div>
                  {stats.weightChange !== 0 && (
                    <div className="stat-item">
                      <span className="stat-label">Weight Change</span>
                      <span
                        className={`stat-value ${
                          stats.weightChange > 0 ? "positive" : "negative"
                        }`}
                      >
                        {stats.weightChange > 0 ? "+" : ""}
                        {stats.weightChange} kg
                      </span>
                    </div>
                  )}
                  <div className="stat-item">
                    <span className="stat-label">Workouts (Last 7 Days)</span>
                    <span className="stat-value">
                      {stats.workoutsLast7Days}
                    </span>
                  </div>
                </div>
                <Link to="/progress" className="btn btn-primary">
                  View Full Progress
                </Link>
              </>
            ) : (
              <p>No progress data yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
