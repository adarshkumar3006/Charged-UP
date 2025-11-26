import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./WorkoutPlan.css";

const WorkoutPlan = () => {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [activeDay, setActiveDay] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkoutPlan();
  }, []);

  const fetchWorkoutPlan = async () => {
    try {
      const res = await axios.get("/api/workout/plan");
      setWorkoutPlan(res.data);
      setActiveDay(0);
    } catch (error) {
      console.error("Fetch workout plan error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="workout-plan-page">
        <Navbar />
        <div className="container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!workoutPlan) {
    return (
      <div className="workout-plan-page">
        <Navbar />
        <div className="container">
          <p>No workout plan available</p>
        </div>
      </div>
    );
  }

  const currentDay = workoutPlan.plan[activeDay];

  return (
    <div className="workout-plan-page">
      <Navbar />
      <div className="container">
        <div className="workout-plan-header">
          <h1>Your Current Workout Plan</h1>
          <div className="workout-plan-info">
            <span className="badge">{workoutPlan.level}</span>
            <span className="badge">{workoutPlan.location}</span>
            <span className="badge">{workoutPlan.daysPerWeek} days/week</span>
          </div>
        </div>

        <div className="workout-plan-tabs">
          {workoutPlan.plan.map((day, index) => (
            <button
              key={index}
              className={`tab-button ${activeDay === index ? "active" : ""}`}
              onClick={() => setActiveDay(index)}
            >
              Day {index + 1}
            </button>
          ))}
        </div>

        <div className="workout-day-card">
          <h2 className="day-name">{currentDay.name}</h2>
          {currentDay.exercises.length > 0 ? (
            <div className="exercises-list">
              {currentDay.exercises.map((exercise, idx) => (
                <div key={idx} className="exercise-card">
                  <div className="exercise-header">
                    <h3>{exercise.name}</h3>
                    <span className="exercise-sets-reps">
                      {exercise.sets} sets × {exercise.reps}
                    </span>
                  </div>
                  {exercise.rest && exercise.rest !== "-" && (
                    <div className="exercise-rest">Rest: {exercise.rest}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rest-day">
              <p>Rest Day - Take it easy and recover! 💪</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlan;
